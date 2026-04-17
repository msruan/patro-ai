"use client";

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
import { chat } from "@/services/chat";
import { MountJson } from "@/utils/mountJson";
import DOMPurify from "dompurify";
import { CornerDownLeft } from "lucide-react";
import { useRef, useState } from "react";
import { env } from "@/env";
import { useRefreshAiContext } from "@/hooks";

const Assets = {
    aiFace: "/images/ai-face.jpg",
    userFace: "/images/user-face.jpg"
} as const


export type Message = {
    variant: "received" | "sent";
    avatarUrl: string;
    content: string;
    timestamp: Date;
    isLoading?: boolean;
};

function useAiChat() {
    const inputRef = useRef<AutosizeTextAreaRef>(null);
    const [messages, setMessages] = useState([] as Message[]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatMode, setChatMode] = useState<"ads" | "general">("general");
    const imageRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const chatRef = useRef<HTMLDivElement>(null);

    function handleImageChange() {
        if (imageRef.current?.files?.[0]) {
            const file = imageRef.current.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    }

    function scroll() {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }

    async function handleSubmit() {
        const value = inputRef.current?.textArea.value;
        let imageFile = undefined;
        if (imageRef.current) {
            imageFile = imageRef?.current.files?.[0];
        }
        setIsLoading(true);
        if (imageFile) {
            inputRef.current!.textArea.value = "";

            const newMessages: Message[] = [
                ...messages,
                {
                    avatarUrl: Assets.userFace,
                    content: value || "",
                    timestamp: new Date(),
                    variant: "sent",
                },
                {
                    avatarUrl: Assets.aiFace,
                    content: value || "",
                    timestamp: new Date(),
                    variant: "received",
                    isLoading: true,
                },
            ];
            setMessages(newMessages);
            if (imageRef.current) {
                imageRef.current.value = "";
            }
            setImagePreview(null); // Clear image preview

            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("prompt", value || "");

            const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/image`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            const { text } = data;

            setMessages((oldValue) => [
                ...oldValue.slice(0, oldValue.length - 1),
                {
                    avatarUrl: Assets.aiFace,
                    content: text,
                    timestamp: new Date(),
                    variant: "received",
                },
            ]);

            scroll();

        } else if (value) {
            inputRef.current!.textArea.value = "";
            const updatedHistory: Message[] = [
                ...messages,
                {
                    avatarUrl: Assets.userFace,
                    content: value,
                    timestamp: new Date(),
                    variant: "sent",
                },
                {
                    avatarUrl: Assets.aiFace,
                    content: value,
                    timestamp: new Date(),
                    variant: "received",
                    isLoading: true,
                },
            ];
            setMessages(updatedHistory);

            const body: { text: string } = await chat(
                MountJson(value, messages, chatMode)
            );

            setMessages((oldValue) => [
                ...oldValue.slice(0, oldValue.length - 1),
                {
                    avatarUrl: Assets.aiFace,
                    content: body.text,
                    timestamp: new Date(),
                    variant: "received",
                },
            ]);
            scroll();
        }
        setIsLoading(false);
    }

    return {
        chatRef,
        imageRef,
        inputRef,
        imagePreview,
        messages,
        isCompletionPending: isLoading,
        handleNewMesssage: handleSubmit,
        handleImageChange,
        chatMode: {
            value: chatMode,
            setValue: setChatMode
        }
    }
}

export function HomePage() {
    useRefreshAiContext()
    const { chatRef, imageRef, inputRef, messages, imagePreview, chatMode, isCompletionPending, handleNewMesssage, handleImageChange } = useAiChat()

    return (
        <div className="h-screen xl:mx-96 ">
            <div className="h-full flex flex-col gap-3 px-8" >
                <ChatMessageList ref={chatRef}>
                    {messages.map((message, index) => (
                        <ChatBubble key={index} variant={message.variant}>
                            <ChatBubbleAvatar src={message.avatarUrl} />
                            <ChatBubbleMessage
                                isLoading={message?.isLoading}
                                variant={message.variant}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(message.content),
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
                        if (e.key !== "Enter" || e.shiftKey) {
                            return;
                        }

                        e.preventDefault();
                        if (!isCompletionPending) {
                            handleNewMesssage();
                        }
                    }}
                    textAreaRef={inputRef}
                    placeholder="Pergunte qualquer coisa..."
                />

                <div className="flex justify-between w-full mb-12">
                    <div className="flex flex-row">
                        <div className="flex flex-row items-center h-16">
                            <Input
                                id="picture"
                                type="file"
                                accept=".jpg,.jpeg,.png,.gif,.webp"
                                ref={imageRef}
                                onChange={handleImageChange}
                            />
                        </div>

                        {imagePreview && (
                            <div className="mb-4">
                                <div className="border-2 border-white shadow-xl rounded-lg ml-4 ">
                                    <img
                                        src={imagePreview}
                                        alt="Image preview"
                                        className="max-w-full h-16 rounded-sm"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row justify-center items-center">
                        {env.NEXT_PUBLIC_ALLOW_ADS_MODE === true &&
                            <div className="flex items-center space-x-2 mr-10">
                                <Switch
                                    checked={chatMode.value === "ads"}
                                    onCheckedChange={() =>
                                        chatMode.setValue((previous) => previous === "ads" ? "general" : "ads")
                                    }
                                    id="ads-mode"
                                />
                                <Label htmlFor="ads-mode">ADS</Label>
                            </div>
                        }
                        <Button
                            disabled={isCompletionPending}
                            onClick={handleNewMesssage}
                            size="default"
                            className="ml-auto gap-1.5"
                        >
                            Enviar mensagem
                            <CornerDownLeft className="size-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
