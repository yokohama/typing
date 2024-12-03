"use client"

import Link from "next/link"

export default function InvitationPage() {
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
        ">親子登録の招待状</div>
        <div>
          <p>既に親子登録済みです。この招待状は無効です。</p>
          <p>
            登録済みの親子は、
            <Link href='/pair'
              className="
                text-blue-400
                font-bold
                hover:text-blue-600
                transition
                duration-300
            ">こちら</Link>
            から確認ができます。
          </p>
        </div>
      </div>
    </div>
  )
}
