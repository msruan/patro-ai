import { NextResponse } from "next/server";

import { model } from "@/main";
export const POST = async (request: Request) => {
  try {
    const prompt = await request.text();
    const result = await model.generateContent(prompt);
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
