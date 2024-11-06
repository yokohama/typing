"use client"

import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const input = searchParams.get('input');

  return (
    <div>
      <main>
        <h1>結果だよーん</h1>
	<p>{input}</p>
      </main>
    </div>
  );
}
