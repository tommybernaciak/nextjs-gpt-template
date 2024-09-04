import { connectToDatabase } from "@/app/db/connect";
import Publication from "@/app/db/models/publication";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  const results = await Publication.find({});
  return NextResponse.json(results);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  await connectToDatabase();
  const result = await Publication.create(data);
  return NextResponse.json({ message: "Publication added", result });
}
