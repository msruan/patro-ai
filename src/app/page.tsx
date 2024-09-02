"use client";
import { Chat } from "@/actions/Chat";
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
import { MountJson } from "@/utils/mountJson";
import { CornerDownLeft, SendHorizonal } from "lucide-react";
import { useRef, useState } from "react";

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

  async function handleImageSubmit() {
    if (imageRef.current.files) {
      const image = imageRef.current.files[0];
      const res = await fetch("http://localhost:3000/api/image", {
        body: image,
        method: "POST",
      });
      console.log("RESPOSTA DA IMAGEM",res)
    }
  }

  async function handleClick() {
    Chat();
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
        body: JSON.stringify(MountJson(value, messages)),
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
          // maxLength={400}
          // maxHeight={200}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          ref={inputRef}
          placeholder="Ask me anything..."
        />
        <div className="flex flex-row">
          <div className="flex flex-row justify-center items-center h-10">
            <Button
              onClick={handleClick}
              size="default"
              className="ml-auto gap-1.5 mb-12"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>

          <div>
            <Label>Send picture</Label>
            <Input id="picture" type="file" ref={imageRef} />
            <Button
              onClick={handleImageSubmit}
              size="default"
              className="ml-2 h-10 w-10"
            >
              <SendHorizonal size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
