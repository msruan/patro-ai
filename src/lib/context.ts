import { Content } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { readFileSync } from "fs";
import { purgeChar } from "@/lib/utils";
import { env } from "@/env";

export async function context() {
  const fileManager = new GoogleAIFileManager(
    env.GOOGLE_GENERATIVE_AI_API_KEY
  );
  const pathToJsonFile = process.cwd() + "/context.json";
  const systemInstruction =
      purgeChar(
        readFileSync(process.cwd() + "/ads-instruction.txt").toString(),
        "\n"
      );
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