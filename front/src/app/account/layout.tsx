"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import Loading from "@/components/Loading";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { session, status } = useRequireAuth();

  if (status === 'loading') {
    return <Loading />;
  }

  if (session) {
    return(
      <div>
        <p>Account Header</p>
	{children}
      </div>
    );
  }
}
