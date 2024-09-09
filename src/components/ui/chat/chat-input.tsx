import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { AutosizeTextarea, AutosizeTextAreaRef } from "../autosize-textarea";
import { RefObject } from "react";

interface ChatInputProps {
  className?: string;
  value?: string;
  maxLength: number;
  maxHeight: number;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textAreaRef: RefObject<AutosizeTextAreaRef>;
  placeholder?: string;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      maxLength,
      maxHeight,
      className,
      value,
      onKeyDown,
      onChange,
      textAreaRef,
      placeholder,
      ...props
    },
    ref
  ) => (
    <AutosizeTextarea
      ref={textAreaRef}
      maxLength={maxLength}
      maxHeight={maxHeight}
      autoComplete="off"
      value={value}
      onKeyDown={onKeyDown}
      onChange={onChange}
      name="message"
      placeholder={placeholder}
      className={cn(
        "max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none",
        className
      )}
      {...props}
    />
  )
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
