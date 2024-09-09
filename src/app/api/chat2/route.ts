import { NextResponse } from "next/server";
import { model } from "@/lib/model";
import { ChatSession } from "@google/generative-ai";
import { ChatRequest } from "@/utils/mountJson";
import { context as readContext } from "@/lib/context";

export const POST = async (request: Request) => {
  try {
    console.log("chegou no bakc");

    const data: ChatRequest = await request.json();
    const context =  await readContext(data.about === "ads");
    const prompt = data.prompt;

    const chat: ChatSession = model.startChat({
      history: [...context, ...data.history],
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
    return NextResponse.json({ text: "Error" });
  }
};
