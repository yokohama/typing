"use client";

import { useEffect } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { SubHeader } from '@/components/SubHeader';
import { Main } from "@/components/Main";
import { RecordIcon } from "@/app/result/components/RecordIcon";

export default function Page({children}: {children: React.ReactNode}) {

  return(
    <RequireAuth>
      <SubHeader title="シューティング">
        <RecordIcon />
      </SubHeader>
      <Main>{children}</Main>
    </RequireAuth>
  );
}
