import { Message } from "@/app/page";

export type ChatRequest = {
  prompt: string;
  history: { role: string; parts: [{ text: string }] }[];
};

export function MountJson(prompt: string, messages: Message[]): ChatRequest {
  const response: ChatRequest = { history: [], prompt: prompt };

  messages.map((message: Message) => {
    response.history.push({
      role: message.variant == "sent" ? "user" : "model",
      parts: [{ text: message.content }],
    });
  });

//   console.log(response);
  

  return response;
}
// {
//     role: "user",
//     parts: [{ text: "Hello, I have 2 dogs in my house." }],
//   },
