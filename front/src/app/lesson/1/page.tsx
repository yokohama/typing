"use client"

import Lesson from '@/app/lesson/components/Lesson';

export default function Page() {
  const title = "オショウのしっぱい";
  const example = "あいうえお";

  return (
    <div>
      <Lesson title={title} example={example} />
    </div>
  );
}
