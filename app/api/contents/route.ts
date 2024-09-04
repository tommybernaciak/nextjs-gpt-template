import { connectToDatabase } from "@/app/db/connect";
import PublicationContent from "@/app/db/models/publicationContent";
import { createEmbedding } from "@/app/utils/createEmbedding";
import { splitByFixedLength } from "@/app/utils/splitText";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await req.json();
  await connectToDatabase();

  if (data.multiple === true) {
    const contentParts = splitByFixedLength(data.content);
    await contentParts.forEach(async (contentPart, i) => {
      const embedding = await createEmbedding(contentPart);
      console.log(`created embedding (${i + 1} / ${contentParts.length})`);
      try {
        await PublicationContent.create({
          publicationId: data.publicationId,
          content: contentPart,
          embedding: embedding,
        });
        console.log(`saved part (${i + 1} / ${contentParts.length})`);
      } catch (error) {
        console.log(error);
      }
    });
    return NextResponse.json({
      message: "Publications added",
      count: contentParts.length,
    });
  } else {
    const embedding = await createEmbedding(data.content);

    const result = await PublicationContent.create({
      publicationId: data.publicationId,
      content: data.content,
      embedding: embedding,
    });
    return NextResponse.json({ message: "Publication added", result });
  }
}
