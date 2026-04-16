import { NextResponse } from "next/server";
import { model } from "@/lib/model";
import { ChatSession } from "@google/generative-ai";
import { ChatRequest } from "@/utils/mountJson";
import { context as readContext } from "@/lib/context";

export const POST = async (request: Request) => {
  try {
    console.log("/chat2 called!");

    const data: ChatRequest = await request.json();
    const context = data.about === "ads" ? await readContext() : [];
    const prompt = data.prompt;

    const chat: ChatSession = model.startChat({
      history: [...context, ...data.history],
      generationConfig: {
        temperature: 2,
      },
    });

    let result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text }, { status: 200, });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ text: "Error" });
  }
};
