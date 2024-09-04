import Publication from "@/app/db/models/publication";
import { IFoundPublicationContent } from "@/app/db/models/publicationContent";
import { Message } from "ai";

export const findPublications = async (
  publicationContents: IFoundPublicationContent[]
) => {
  const publications = publicationContents.map((pc) => pc.publicationId);
  const uniquePubIds = Array.from(new Set(publications));
  if (uniquePubIds.length === 0) {
    return [];
  }
  const results = await Publication.find({ _id: { $in: uniquePubIds } });
  return results;
};

export const aggregateOptions = (limit: number, embedding: number[]) => {
  return [
    {
      $vectorSearch: {
        index: "content-search",
        limit: limit,
        numCandidates: limit,
        path: "embedding",
        queryVector: embedding,
      },
    },
    {
      $project: {
        publicationId: 1,
        content: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ];
};

export const getUserMessages = (messages: Message[]) => {
  return messages.filter((message) => message.role === "user");
};
