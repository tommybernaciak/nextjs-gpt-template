import { Schema, model, models, Types } from "mongoose";

export interface IPublicationContent extends Document {
  _id: Types.ObjectId;
  publicationId: Types.ObjectId;
  content: string;
  embedding: number[];
}

export interface IFoundPublicationContent {
  publicationId: Types.ObjectId;
  content: string;
  score: number;
}

const PublicationContentSchema: Schema<IPublicationContent> = new Schema(
  {
    publicationId: {
      type: Schema.Types.ObjectId,
      ref: "Publication",
      required: true,
    },
    content: { type: String, required: true },
    embedding: { type: [Number], required: true },
  },
  {
    timestamps: true,
  }
);

const PublicationContent =
  models.PublicationContent ||
  model<IPublicationContent>("PublicationContent", PublicationContentSchema);

export default PublicationContent;
