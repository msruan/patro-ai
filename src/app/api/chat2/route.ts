import { NextResponse } from "next/server";
import { model } from "@/main";

export const POST = async (request: Request) => {
  try {
    const prompt = await request.text();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // const chat = model.startChat({
    //   history: [
    //     {
    //       role: "user",
    //       parts: [{ text: "Hello" }],
    //     },
    //     {
    //       role: "model",
    //       parts: [{ text: "Great to meet you. What would you like to know?" }],
    //     },
    //   ],
    // });
    // let result = await chat.sendMessage("I have 2 dogs in my house.");
    // console.log(result.response.text());
    // result = await chat.sendMessage("How many paws are in my house?");
    // console.log(result.response.text());

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
