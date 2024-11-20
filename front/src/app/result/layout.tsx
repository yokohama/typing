"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { SubHeader } from "@/components/SubHeader";
import { Main } from "@/components/Main";
import { RecordIcon } from "./components/RecordIcon";

export default function Page({children}: {children: React.ReactNode}) {
  return(
    <RequireAuth>
      <SubHeader title="結果">
        <RecordIcon />
      </SubHeader>
      <Main>{children}</Main>
    </RequireAuth>
  );
}
