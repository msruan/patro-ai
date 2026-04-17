
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import os from 'os'
import { aiModel } from "@/lib/ai-model";
import { logger } from "@/lib/logger";

async function fileToBase64Url(file: File): Promise<string> {
  const filePath = path.join(os.tmpdir(), file.name);
  const buffer = await file.bytes();
  fs.writeFileSync(filePath, buffer);

  return fs.readFileSync(filePath).toString("base64")
}


export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();

    const prompt = formData.get("prompt") as string;
    const file = formData.get("file") as File;

    const base64Image = await fileToBase64Url(file)

    const text: string | null = await aiModel.makeImageCompletion(prompt, base64Image)

    return NextResponse.json({ text });
  } catch (error) {
    logger.error(error);
    return NextResponse.json({}, { status: 500 });
  }
};
