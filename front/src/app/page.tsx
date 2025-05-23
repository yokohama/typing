"use client"

import { Alert } from '@/components/Alert';

export default function Home() {
  return (
    <div>
      <main className="text-center py-8">
        <Alert />
        <h1 className="
          text-2xl sm:text-3xl lg:text-4xl 
          font-bold
        ">Welcome!</h1>
        <p className="mt-4 text-gray-600">Thank you for visiting our site.</p>
      </main>
    </div>
  );
}
