import { connectToDatabase } from "@/app/db/connect";
import PublicationContent, {
  IFoundPublicationContent,
} from "@/app/db/models/publicationContent";
import Settings, { ISettings } from "@/app/db/models/settings";
import { createEmbedding } from "@/app/utils/createEmbedding";
import { DEFAULT_APP_SETTINGS } from "@/app/utils/settings";
import { openai } from "@ai-sdk/openai";
import { OpenAIChatModelId } from "@ai-sdk/openai/internal";
import { StreamData, streamText } from "ai";
import { aggregateOptions, findPublications, getUserMessages } from "./utils";

export async function POST(req: Request) {
  await connectToDatabase();
  const settingsRes: ISettings[] = await Settings.find({});
  const settings: ISettings = settingsRes[0] || DEFAULT_APP_SETTINGS;
  const { messages } = await req.json();

  // Generate an embedding from the user's messages
  const userMessages = getUserMessages(messages);
  const userMessagesContent = userMessages.map((m) => m.content).join(", ");
  const embedding = await createEmbedding(userMessagesContent);

  // Find the most relevant publication contents
  let foundPublicationContents: IFoundPublicationContent[] = [];
  try {
    foundPublicationContents = await PublicationContent.aggregate(
      aggregateOptions(5, embedding)
    );
  } catch (err) {
    console.log(err);
  }
  console.log(
    foundPublicationContents.map((pc) => `${pc.publicationId} - ${pc.score}`)
  );

  const filteredPublicationContents = foundPublicationContents.filter(
    (pc) => pc.score * 100 > settings.match_quality
  );

  const publications = await findPublications(filteredPublicationContents);
  console.log(publications);

  // Generate the instructions for the model
  const lastUserMessage = userMessages[userMessages.length - 1];
  const instructions = `${settings.instructions} 
    PYTANIE: ${lastUserMessage.content}. 
    DO ODPOWIEDZI WYKORZYSTAJ TE TREŚCI: ${filteredPublicationContents
      .map((pc) => pc.content)
      .join(" ")}. 
    NAZWY ŹRÓDEŁ UŻYTYCH DO ODPOWIEDZI: ${publications}`;

  // Stream the response from the model
  const data = new StreamData();
  const model = openai(settings.model as OpenAIChatModelId);

  const textStream = await streamText({
    model: model,
    system: instructions,
    messages: messages,
    onFinish() {
      data.close();
    },
  });

  return textStream.toDataStreamResponse({ data });
}
