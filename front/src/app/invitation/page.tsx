"use client"

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function InvitationPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('inviteChildUserId');

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem("inviteChildUserId", userId);
    }
  }, [userId]);

  return (
    <GoogleSignInButton />
  )
}
