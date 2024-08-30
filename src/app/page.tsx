"use client";

import { useRef, useState } from "react";

export default function Home() {
  const inputRef = useRef({} as HTMLInputElement);
  const [responseText, setResponseText] = useState("");

  async function handleClick() {
    const value = inputRef.current.value;
    if (value) {
      const res = await fetch("http://localhost:3001/api/chat2", {
        body: value,
        method: "POST",
      });
      if (res.ok) {
        const body = await res.json();
        setResponseText(body.text);
      }
    }
  }

  return (
    <div className="h-full">
      <label>Manda pro gpt</label>
      <input ref={inputRef} type="text" />
      <button onClick={handleClick}>Submit</button>
      <div>Resposta: {responseText}</div>
    </div>
  );
}
