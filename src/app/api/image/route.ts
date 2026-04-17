
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { aiClient } from "@/lib/ai-client";
import { env } from "@/env";

const uploadDir = path.join(process.cwd(), "/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const prompt = formData.get("prompt") as string;

    const filePath = path.join(uploadDir, file.name);
    const buffer = await file.bytes();
    fs.writeFileSync(filePath, buffer);

    const base64Image = fs.readFileSync(filePath).toString("base64")

    console.log()

    const completion = await aiClient.chat.completions.create({
      model: env.OPENAI_API_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            },
            {
              type: "text",
              text: prompt
            },
          ]
        },
      ]
    })

    const text = completion.choices[0]?.message.content

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
};
