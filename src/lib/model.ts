import { GoogleGenerativeAI } from "@google/generative-ai";
import { readFileSync } from "fs";
import { purgeChar } from "./utils";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

let systemInstruction: string = readFileSync(
  process.cwd() + "/system-instruction.txt"
).toString();

console.log(systemInstruction);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: systemInstruction,
});

export { model };
