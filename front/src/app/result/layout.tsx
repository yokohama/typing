"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { SubHeader, SubHeaderButton } from "@/components/SubHeader";
import { Main } from "@/components/Main";

export default function Page({children}: {children: React.ReactNode}) {
  return(
    <RequireAuth>
      <SubHeader title="結果">
        <SubHeaderButton
          title='レコード'
          url='/result'
        />
      </SubHeader>
      <Main>{children}</Main>
    </RequireAuth>
  );
}
