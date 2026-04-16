import { env } from "@/env";
import { OpenAI } from "openai";

export const aiClient = new OpenAI({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_API_URL, });
