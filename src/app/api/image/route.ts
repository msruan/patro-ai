import { gemini } from "@/lib/gemini";
import { Part } from "@google/generative-ai";

async function fileToGenerativePart(file) {
  const base64EncodedData = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: base64EncodedData, mimeType: file.type },
  };
}

export const POST = async (request: Request) => {
  console.log("foi pra função de post");
  const imagePart = await fileToGenerativePart(request);
  const prompt = "What you see in this image";

  try {
    const result = await model.generateContent([prompt, imagePart as Part]);
    const response = await result.response.text();

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating content:", error);
  }
};
