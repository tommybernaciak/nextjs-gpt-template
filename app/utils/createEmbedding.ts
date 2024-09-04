import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

export const createEmbedding = async (content: string) => {
  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: content,
  });
  return embedding;
};
