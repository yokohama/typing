"use client";

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
          <h2 className="text-2xl font-semibold text-gray-800">結果</h2>
        </header>
        <main className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
          {children}
        </main>
      </div>
    );
  }
}
