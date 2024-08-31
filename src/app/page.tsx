"use client";

import { useRef, useState } from "react";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
const ia =
  "https://i.pinimg.com/736x/8f/87/39/8f8739fbfae6ccde444f6bcd69007276.jpg";
const asa =
  "https://i.pinimg.com/564x/15/57/74/155774f070222683c5730fce24794328.jpg";
type Message = {
  variant: "received" | "sent";
  avatar_url: string;
  content: string;
  timestamp: Date;
};

export default function Home() {
  const inputRef = useRef({} as HTMLTextAreaElement);
  const [messages, setMessages] = useState([] as Message[]);

  async function handleClick() {
    const value = inputRef.current.value;
    console.log(messages);
    if (value) {
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
      const res = await fetch("http://localhost:3000/api/chat2", {
        body: value,
        method: "POST",
      });
      if (res.ok) {
        const body = await res.json();
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
  }

  return (
    <div className="h-screen mx-96 ">
      <div className="h-full flex flex-col gap-3">
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble variant={message.variant}>
              <ChatBubbleAvatar src={message.avatar_url} />
              <ChatBubbleMessage variant={message.variant}>
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
        </ChatMessageList>
          <ChatInput
            onKeyDown={(e) => e.key === "Enter" && handleClick()}
            ref={inputRef}
            placeholder="Type your message here..."
          />
          <Button onClick={handleClick} size="sm" className="ml-auto gap-1.5 mb-12">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
      </div>
    </div>
  );
}
