"use client"

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function InvitationPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('inviteChildUserId');
  const userName = searchParams.get('inviteChildUserName');

  useEffect(() => {
    if (userId) {
      sessionStorage.setItem("inviteChildUserId", userId);
    }
  }, [userId]);

  return (
    <div
      className="
        my-8
        p-4
        bg-pink-100
        rounded-xl
        border-4
        border-pink-200
    ">
      <div className="mb-10 text-center">
        <div className="
          mb-6
          text-xl
          font-bold
        ">
          <div>
            <span>{userName}</span>さんからの
          </div>
          <div>親子登録の招待状</div>
        </div>
        <p>{userName}さんから、あなた宛てに親子登録の招待状が届いています。</p>
        <p>お心当たりのある方は、以下のボタンより承認をしてください。</p>
      </div>
      <div className="mb-6 flex justify-center">
        <GoogleSignInButton />
      </div>
    </div>
  )
}
