"use client";

import Link from 'next/link';

import { useRequireAuth } from "@/hooks/useRequireAuth";
import Loading from "@/components/Loading";

export default function Page({children}: {children: React.ReactNode}) {
  const { session, status } = useRequireAuth();

  if (status === 'loading') {
    return <Loading />;
  }

  if (session) {
    return(
      <div className="min-h-screen bg-gray-50 flex flex-col items-center rounded-xl">
        <header className="w-full bg-white shadow py-4 mb-8 flex justify-between items-center px-6 rounded-t-xl">
          <h2 className="text-2xl font-semibold text-gray-800">レッスン</h2>
          <Link href="/result">
            <button className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              過去の結果を見る
            </button>
          </Link>
        </header>
        <main className="w-full max-w-5xl bg-white p-6 rounded-lg shadow-md">
          {children}
        </main>
      </div>
    );
  }
}
