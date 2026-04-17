import { env } from "@/env";
import { aiClient } from "@/lib/ai-client";
import { ChatRequest } from "@/utils/mountJson";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    //     let systemInstruction: string = readFileSync(
    //   process.cwd() + "/system-instruction.txt"
    // ).toString();
    const data: ChatRequest = await req.json();
    //   const context = data.about === "ads" ? await readContext() : [];

    const completion = await aiClient.chat.completions.create({
        model: env.OPENAI_API_MODEL,
        messages: data.messages
    })

    return NextResponse.json({ text: completion.choices[0]?.message.content })
}