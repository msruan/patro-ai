import { model } from "@/main";
import fs from "fs";
import path from "path";

function fileToGenerativePart(path: string, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType,
    },
  };
}

const uploadDir = path.join(process.cwd(), "/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const prompt = formData.get("prompt") as string;
    
    const filePath = path.join(uploadDir, file.name);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const imagePart = fileToGenerativePart(filePath, file.type);

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();

    return new Response(JSON.stringify({ text }));
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Erro ao processar a requisição" }),
      { status: 500 }
    );
  }
};
