import { model } from "@/main";

function fileToGenerativePart(base64String: string, mimeType: string) {
  return {
    inlineData: {
      data: base64String,
      mimeType,
    },
  };
}

export const POST = async (request: Request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as string;

    const prompt = formData.get("prompt") as string;
    const image = fileToGenerativePart(file, "image/*");

    const result = await model.generateContent([prompt,image]);
    const response = result.response;
    const text = response.text();

    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response("Error processing image", { status: 500 });
  }
};
