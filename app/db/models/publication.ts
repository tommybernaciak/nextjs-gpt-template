import { Schema, model, models, Types } from "mongoose";

export interface IPublication extends Document {
  _id: Types.ObjectId;
  name: string;
  authors: string[];
  year?: number;
  publisher?: string;
  isbn?: string;
}

const PublicationSchema: Schema<IPublication> = new Schema(
  {
    name: { type: String, required: true },
    authors: { type: [String], required: true },
    year: { type: Number },
    publisher: { type: String },
    isbn: { type: String },
  },
  {
    timestamps: true,
  }
);

const Publication =
  models.Publication || model<IPublication>("Publication", PublicationSchema);

export default Publication;
