"use client"

import Lesson from '@/app/lesson/components/Lesson';

export default function Page() {
  const title = "ショウのしっぱい";
  const example = "かきくけこ";

  return (
    <div>
      <Lesson title={title} example={example} />
    </div>
  );
}
