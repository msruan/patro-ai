'use client'
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { chat } from "@/services/chat";
import { MountJson } from "@/utils/mountJson";
import { CornerDownLeft, SendHorizonal } from "lucide-react";

const ia =
  "https://i.pinimg.com/736x/8f/87/39/8f8739fbfae6ccde444f6bcd69007276.jpg";
const asa =
  "https://i.pinimg.com/564x/15/57/74/155774f070222683c5730fce24794328.jpg";

export type Message = {
  variant: "received" | "sent";
  avatar_url: string;
  content: string;
  timestamp: Date;
};

export default function Home() {
  const inputRef = useRef({} as HTMLTextAreaElement);
  const [messages, setMessages] = useState([] as Message[]);
  const imageRef = useRef({} as HTMLInputElement);

  async function handleSubmit() {
    const value = inputRef.current.value;
    const imageFile = imageRef.current.files?.[0];

    if (imageFile) {
      
      const newMessages: Message[] = [
        ...messages,
        {
          avatar_url: asa,
          content: value || "",
          timestamp: new Date(),
          variant: "sent",
        },
      ];
      setMessages(newMessages);
      imageRef.current.value = "";

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("prompt", value || "");

      const res = await fetch("http://localhost:3000/api/image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const { text } = data;

      setMessages((oldMessages) => [
        ...oldMessages,
        {
          avatar_url: ia,
          content: text,
          timestamp: new Date(),
          variant: "received",
        },
      ]);
    } else if (value) {
      
      const newMessages: Message[] = [
        ...messages,
        {
          avatar_url: asa,
          content: value,
          timestamp: new Date(),
          variant: "sent",
        },
      ];
      setMessages(newMessages);
      inputRef.current.value = "";

      const body: { text: string } = await chat(
        JSON.stringify(MountJson(value, messages))
      );

      setMessages((oldValue) => [
        ...oldValue,
        {
          avatar_url: ia,
          content: body.text,
          timestamp: new Date(),
          variant: "received",
        },
      ]);
    }
  }

  return (
    <div className="h-screen xl:mx-96 ">
      <div className="h-full flex flex-col gap-3 px-8">
        <ChatMessageList>
          {messages.map((message, index) => (
            <ChatBubble key={index} variant={message.variant}>
              <ChatBubbleAvatar src={message.avatar_url} />
              <ChatBubbleMessage variant={message.variant}>
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
        </ChatMessageList>

        <ChatInput
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          ref={inputRef}
          placeholder="Ask me anything..."
        />
        <div className="flex flex-row w-full justify-between mb-12">
          <div className="flex flex-row items-center">
            <Label>Send picture</Label>
            <Input id="picture" type="file" ref={imageRef} className="mr-2" />
          </div>

          <div className="flex flex-row justify-center items-center h-10">
            <Button
              onClick={handleSubmit}
              size="default"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
