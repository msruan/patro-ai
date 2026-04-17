import { aiModel } from "@/lib/ai-model";
import { ChatRequest } from "@/utils/mountJson";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const data: ChatRequest = await req.json();

    const text = await aiModel.makeChatCompletion(data)

    return NextResponse.json({ text })
}