import { Schema, Types, model, models } from "mongoose";

export interface ISettings {
  _id?: Types.ObjectId;
  model: "gpt-4-turbo" | "gpt-4o" | "gpt-4o-mini";
  match_quality: number;
  instructions: string;
}

const SettingsSchema: Schema<ISettings> = new Schema(
  {
    model: {
      type: String,
      required: true,
      enum: ["gpt-4-turbo", "gpt-4o", "gpt-4o-mini"],
    },
    match_quality: { type: Number, required: true, min: 0, max: 100 },
    instructions: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Settings =
  models.Settings || model<ISettings>("Settings", SettingsSchema);

export default Settings;
