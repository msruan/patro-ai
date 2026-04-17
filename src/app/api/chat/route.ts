import { env } from "@/env";
import { aiClient } from "@/lib/ai-client";
import { ChatRequest } from "@/utils/mountJson";
import { readFileSync } from "fs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const systemInstruction = readFileSync(
        process.cwd() + "/system-instructions.txt"
    ).toString();
    const data: ChatRequest = await req.json();

    const completion = await aiClient.chat.completions.create({
        model: env.OPENAI_API_MODEL,
        messages: [
            {
                role: 'developer',
                content: systemInstruction
            },
            ...data.messages
        ],
    })

    return NextResponse.json({ text: completion.choices[0]?.message.content })
}