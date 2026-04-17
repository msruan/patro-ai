import DOMPurify from "dompurify";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "./ui/chat/chat-bubble";
import { ChatMessageList } from "./ui/chat/chat-message-list";
import { RefObject } from "react";
import { Message } from "@/types";

export function MessageList({ messages, listRef }: { messages: Message[], listRef: RefObject<HTMLDivElement | null> }) {
    return (
        <ChatMessageList ref={listRef}>
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
    )
}