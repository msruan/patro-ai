import { env } from "@/env";
import { logger } from "@/lib/logger";
import { ChatRequest } from "@/types";

export async function chat(body: ChatRequest): Promise<{ text: string }> {
  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/chat`, {
      body: JSON.stringify(body),
      method: "POST",
    });
    if (res.ok) {
      return await res.json();
    }
    return { text: "Sorry, error" }
  } catch (err) {
    logger.error(err);
    return { text: "Sorry, error" }
  }
}
