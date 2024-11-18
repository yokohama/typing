"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import Loading from "@/components/Loading";
import { SubHeader, SubHeaderButton } from "@/components/SubHeader";

export default function Page({children}: {children: React.ReactNode}) {
  const { session, status } = useRequireAuth();

  if (status === 'loading') {
    return <Loading />;
  }

  if (session) {
    return(
      <div className="min-h-screen bg-gray-50 flex flex-col items-center rounded-xl">
        <SubHeader title="結果">
          <SubHeaderButton
            title='レコード'
            url='/result'
          />
        </SubHeader>

        <main className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
          {children}
        </main>
      </div>
    );
  }
}
