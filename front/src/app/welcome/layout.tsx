"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { SubHeader } from "@/components/SubHeader";
import { Main } from "@/components/Main";
import { ListIcon } from "@/components/ListIcon";

export default function Page({children}: {children: React.ReactNode}) {
  return(
    <RequireAuth>
      <SubHeader title="ようこそ">
        <ListIcon href="/welcome" />
      </SubHeader>
      <Main>{children}</Main>
    </RequireAuth>
  );
}
