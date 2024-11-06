"use client";

import Link from "next/link";
import { useSession } from 'next-auth/react';

import Login from "@/components/Login";

export default function Page() {
  const { data: session } = useSession();

  return(
    <div>
      <Link key="top" href="/">TOP</Link>

      {session && (
        <div>
          <Link key="lesson" href="/lesson">Lesson</Link>
          <Link key="account" href="/account">Account</Link>
	</div>
      )}

      <Login />
    </div>
  );
}
