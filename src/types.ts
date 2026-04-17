export type Message = {
    variant: "received" | "sent";
    avatarUrl: string;
    content: string;
    timestamp: Date;
    isLoading?: boolean;
};

export type ChatRequest = {
  messages: { role: "assistant" | "user"; content: string }[];
  about: string;
};

export function parseChat(
  prompt: string,
  history: Message[],
  about: string = "general"
): ChatRequest {
  const response: ChatRequest = { messages: [], about };

  history.map((message: Message) => {
    response.messages.push({
      role: message.variant == "sent" ? "user" : "assistant",
      content: message.content,
    });
  });

  response.messages.push(
    {
      role: 'user',
      content: prompt
    }
  )

  return response;
}
