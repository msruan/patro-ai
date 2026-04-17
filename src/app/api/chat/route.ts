import { aiModel } from "@/lib/ai-model";
import { logger } from "@/lib/logger";
import { ChatRequest } from "@/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {

    const data: ChatRequest = await req.json();
  
    const text = await aiModel.makeChatCompletion(data)
  
    return NextResponse.json({ text })
  } 
  catch(err){
    logger.error(err)
    return NextResponse.json({}, { status: 500 })
  } 
}