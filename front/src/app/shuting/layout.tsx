"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { Alert } from "@/components/Alert";
import { SubHeader } from '@/components/SubHeader';
import { Main } from "@/components/Main";
import { RecordIcon } from "@/app/result/components/RecordIcon";

export default function Page({children}: {children: React.ReactNode}) {

  return(
    <RequireAuth>
      <SubHeader title="シューティング">
        <RecordIcon />
      </SubHeader>
      <Alert />
      <Main>{children}</Main>
    </RequireAuth>
  );
}
