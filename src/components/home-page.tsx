"use client";

import { AutosizeTextAreaRef } from "@/components/ui/autosize-textarea";
import { chat } from "@/services/chat";
import { useRef, useState } from "react";
import { env } from "@/env";
import { useRefreshAiContext } from "@/hooks";
import { MessageList } from "./message-list";
import { MessageInput } from "./message-input";
import { Message, parseChat } from "@/types";
import { Assets } from "@/assets";

function useAiChat() {
    const inputRef = useRef<AutosizeTextAreaRef>(null);
    const [messages, setMessages] = useState<Message[]>([]);
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
                parseChat(value, messages, chatMode)
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
                <MessageList listRef={chatRef} messages={messages} />
                <MessageInput imageRef={imageRef} inputRef={inputRef} imagePreview={imagePreview} chatMode={chatMode} isCompletionPending={isCompletionPending} handleNewMesssage={handleNewMesssage} handleImageChange={handleImageChange} />

            </div>
        </div>
    );
}
