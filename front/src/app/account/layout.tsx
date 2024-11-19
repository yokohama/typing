"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { SubHeader } from "@/components/SubHeader";
import { Main } from "@/components/Main";

export default function Page({children}: {children: React.ReactNode}) {
  return (
    <RequireAuth>
      <SubHeader title="アカウント" />
      <Main>{children}</Main>
    </RequireAuth>
  );
}
