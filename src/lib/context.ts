import { readFileSync } from "fs";
import { purgeChar } from "@/lib/utils";

export async function context() {
  const pathToJsonFile = process.cwd() + "/context.json";
  const systemInstruction =
    purgeChar(
      readFileSync(process.cwd() + "/ads-instruction.txt").toString(),
      "\n"
    );

  return [
    {
      role: "user",
      parts: [
        {
          pathToJsonFile
        },
        {
          text: systemInstruction,
        },
      ],
    },
  ]
}