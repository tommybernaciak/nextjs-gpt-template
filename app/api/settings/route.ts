import { connectToDatabase } from "@/app/db/connect";
import Settings, { ISettings } from "@/app/db/models/settings";
import { DEFAULT_APP_SETTINGS } from "@/app/utils/settings";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const settings: ISettings[] = await Settings.find({}).limit(1);
  const settingsItem: ISettings = settings[0] || DEFAULT_APP_SETTINGS;
  return NextResponse.json(settingsItem);
}

// create settings first time
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const data = await req.json();
  const settingsItem: ISettings = data || DEFAULT_APP_SETTINGS;
  const result = await Settings.create(settingsItem);
  return NextResponse.json({ message: "Settings saved", result });
}

// update existing settings
export async function PUT(req: NextRequest) {
  await connectToDatabase();
  const data = await req.json();
  const settings: ISettings[] = await Settings.find({}).limit(1);
  const settingsItem: ISettings = settings[0] || DEFAULT_APP_SETTINGS;
  const result = await Settings.updateOne(
    { _id: settingsItem._id },
    { $set: data }
  );
  return NextResponse.json({ message: "Settings saved", result });
}
