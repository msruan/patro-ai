import api from "@/config/api";
export async function Chat() {
  return await api.post("/chat", "oi gemini...");
}
