import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const question = await request.text();
    const model = google("gemini-1.5-flash-latest");
    const { text } = await generateText({
      model,
      prompt: question,
    });
    console.log(text);
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  }
};
