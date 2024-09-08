"use client";
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
import { api } from "@/config/api";
import { chat } from "@/services/chat";
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

  function convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const target = event.target as FileReader;
        if (target.result) {
          const base64String = (target.result as string).split(",")[1]; // Extrai a string Base64
          resolve(base64String);
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file); // Lê o arquivo como URL de dados
    });
  }

  async function handleImageSubmit() {
    if (imageRef.current.files) {
      const image = imageRef.current.files[0];
      const url = await convertImageToBase64(image);
      const value = inputRef.current.value;

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

        const formData = new FormData();
        formData.append("file", url);
        formData.append("prompt", value);
        const res = await fetch("http://localhost:3000/api/image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

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
      }
    }
  }

  async function handleClick() {
    const value = inputRef.current.value;

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
          // maxLength={400}
          // maxHeight={200}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          ref={inputRef}
          placeholder="Ask me anything..."
        />
        <div className="flex flex-row w-full justify-between mb-12">
          <div className="flex flex-row items-center">
            <Label>Send picture</Label>
            <Input id="picture" type="file" ref={imageRef} className="mr-2" />
            <Button
              onClick={handleImageSubmit}
              size="default"
              className="ml-auto h-10"
            >
              <SendHorizonal className="size-2.5" />
            </Button>
          </div>

          <div className="flex flex-row justify-center items-center h-10">
            <Button
              onClick={handleClick}
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
