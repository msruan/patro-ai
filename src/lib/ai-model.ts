import { env } from "@/env";
import { ChatRequest } from "@/types";
import { readFileSync } from "fs";
import { OpenAI } from "openai";

const openaiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_API_URL, });

export const aiModel = {
  makeChatCompletion,
  makeImageCompletion
}

function getSystemInstructions() {
  return readFileSync(
    process.cwd() + "/system-instructions.txt"
  ).toString();
}

async function makeChatCompletion(chat: ChatRequest,) {
  const completion = await openaiClient.chat.completions.create({
    model: env.OPENAI_API_MODEL,
    messages: [
      {
        role: 'developer',
        content: getSystemInstructions()
      },
      ...chat.messages
    ],
  })

  return completion.choices[0]?.message.content ?? null;
}

async function makeImageCompletion(prompt: string, base64Image: string): Promise<string | null> {
  const completion = await openaiClient.chat.completions.create({
    model: env.OPENAI_API_MODEL,
    messages: [
      {
        role: 'developer',
        content: getSystemInstructions()
      },
      {
        role: 'user',
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`
            }
          },
        ]
      },
    ]
  })

  const text = completion.choices[0]?.message.content

  return text ?? null;
}