import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { readFileSync } from "fs";
import { purgeChar } from "@/lib/utils";
export async function context(ads: boolean = false) {
  const fileManager = new GoogleAIFileManager(
    process.env.GOOGLE_GENERATIVE_AI_API_KEY!
  );
  const pathToJsonFile = process.cwd() + "/context.json";
  let systemInstruction: string = purgeChar(
    readFileSync(process.cwd() + "/system-instruction.txt").toString(),
    "\n"
  );
  if (ads) {
    systemInstruction +=
      "\n" +
      purgeChar(
        readFileSync(process.cwd() + "/ads-instruction.txt").toString(),
        "\n"
      );
  }
  const fileResult = await fileManager.uploadFile(pathToJsonFile, {
    mimeType: "text/plain",
  });
  return [
    {
      role: "user",
      parts: [
        {
          fileData: {
            mimeType: fileResult.file.mimeType,
            fileUri: fileResult.file.uri,
          },
        },
        {
          text: systemInstruction,
        },
      ],
    },
  ] as Content[];
}
