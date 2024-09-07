import { NextResponse } from "next/server";
import { model } from "@/main";
import { ChatSession } from "@google/generative-ai";
import { ChatRequest } from "@/utils/mountJson";

export const POST = async (request: Request) => {
  try {
    const data: ChatRequest = await request.json();
    const prompt = data.prompt;
    console.log("chegou no bakc");
    const chat: ChatSession = model.startChat({
      history: data.history,
    });

    let result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

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
