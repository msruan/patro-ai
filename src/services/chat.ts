import { logger } from "@/lib/logger";
import { ChatRequest } from "@/utils/mountJson";

export async function chat(body: ChatRequest): Promise<{ text: string }> {
  try {
    const res = await fetch("http://localhost:3000/api/chat", {
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
