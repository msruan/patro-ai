'use client'
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";

import { AutosizeTextAreaRef } from "@/components/ui/autosize-textarea";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { highlightWords } from "@/lib/utils";
import { chat } from "@/services/chat";
import { MountJson } from "@/utils/mountJson";
import DOMPurify from "dompurify";
import { CornerDownLeft } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import { refresh } from "./actions/refresh";

const ia =
  "https://i.pinimg.com/736x/8f/87/39/8f8739fbfae6ccde444f6bcd69007276.jpg";
const asa =
  "https://i.pinimg.com/564x/15/57/74/155774f070222683c5730fce24794328.jpg";

export type Message = {
  variant: "received" | "sent";
  avatar_url: string;
  content: string;
  timestamp: Date;
  isLoading?: boolean;
};

export default function Home() {
  useEffect(() => {
    refresh().then();
  }, []);
  const inputRef = useRef<AutosizeTextAreaRef>(null);
  const [messages, setMessages] = useState([] as Message[]);
  const [chatMode, setChatMode] = useState<"ads" | "general">("general");
  const imageRef = useRef({} as HTMLInputElement);
  const chatRef = useRef<HTMLDivElement>(null);


  function scroll() {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }

  async function handleSubmit() {
    const value = inputRef.current?.textArea.value;
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
        {
          avatar_url: ia,
          content: value || "",
          timestamp: new Date(),
          variant: "received",
          isLoading: true,
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

      setMessages((oldValue) => [
        ...oldValue.slice(0, oldValue.length - 1),
        {
          avatar_url: ia,
          content: text,
          timestamp: new Date(),
          variant: "received",
        },
      ]);
      scroll();

    } else if (value) {

      const newMessages: Message[] = [
        ...messages,
        {
          avatar_url: asa,
          content: value,
          timestamp: new Date(),
          variant: "sent",
        },
        {
          avatar_url: ia,
          content: value,
          timestamp: new Date(),
          variant: "received",
          isLoading: true,
        },
      ];
      setMessages(newMessages);
      inputRef.current!.textArea.value = "";

      const body: { text: string } = await chat(
        JSON.stringify(MountJson(value, messages, chatMode))
      );

      setMessages((oldValue) => [
        ...oldValue.slice(0, oldValue.length - 1),
        {
          avatar_url: ia,
          content: body.text,
          timestamp: new Date(),
          variant: "received",
        },
      ]);
      scroll();


    }
  }

  return (
    <div className="h-screen xl:mx-96 ">
      <div className="h-full flex flex-col gap-3 px-8" >
        <ChatMessageList ref={chatRef}>
          {messages.map((message, index) => (
            <ChatBubble key={index} variant={message.variant}>
              <ChatBubbleAvatar src={message.avatar_url} />
              <ChatBubbleMessage
                isLoading={message?.isLoading}
                variant={message.variant}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(highlightWords(message.content)),
                  }}
                />
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
        </ChatMessageList>

        <ChatInput
          maxLength={400}
          maxHeight={200}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          textAreaRef={inputRef}
          placeholder="Pergunte qualquer coisa..."
        />

        <div className="flex justify-between w-full  mb-12">
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
              Enviar mensagem
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={chatMode === "ads"}
              onCheckedChange={() =>
                setChatMode(chatMode === "ads" ? "general" : "ads")
              }
              id="ads-mode"
            />
            <Label htmlFor="ads-mode">ADS</Label>
          </div>
        </div>
      </div>
    </div>
  );
}
