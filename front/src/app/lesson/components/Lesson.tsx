import { useRouter } from "next/navigation";
import { useState } from "react";
import React, { FormEvent } from "react";

export default function Lesson({ title, example }: { title: string, example: string }) {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/lesson/result?input=${input}`);
  };

  return(
    <div>
      <main>
        <h1>{title}</h1>
        <div>{example}</div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">送信</button>
        </form>
      </main>
    </div>
  );
}
