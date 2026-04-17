import { Button } from "@/components/ui/button";

import { ChatInput } from "@/components/ui/chat/chat-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CornerDownLeft } from "lucide-react";
import { env } from "@/env";
import { Dispatch, RefObject, SetStateAction } from "react";
import { AutosizeTextAreaRef } from "./ui/autosize-textarea";


export function MessageInput({
    imageRef,
    inputRef,
    imagePreview,
    isCompletionPending,
    handleNewMesssage,
    handleImageChange,
    chatMode
}: {
    imageRef: RefObject<HTMLInputElement | null>;
    inputRef: RefObject<AutosizeTextAreaRef | null>;
    imagePreview: string | null;
    isCompletionPending: boolean;
    handleNewMesssage: () => Promise<void>;
    handleImageChange: () => void;
    chatMode: {
        value: "ads" | "general";
        setValue: Dispatch<SetStateAction<"ads" | "general">>;
    };
}) {
    return (
        <div>
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
    )
}