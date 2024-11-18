import React from "react";
import Link from "next/link";
import Image from "next/image";

import { signOut } from 'next-auth/react';

import { useUser } from '@/context/UserContext';

type PopupProps = {
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
};

export default function Popup({ 
  isOpen,
  setIsOpen,
}: PopupProps) {
  const { userInfo } = useUser();

  return (
    <>
      {isOpen && (
        <div className="absolute right-0 mt-2 py-12 w-64 bg-gray-100 border border-gray-200 rounded-xl shadow-lg p-4">
          <button onClick={() => setIsOpen(false)} className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold">
            &times;
          </button>

          <div className="flex flex-col items-center text-center">
            {userInfo.image && (
              <Image 
                src={userInfo.image || "/images/default-avatar.png"} 
                alt="User Avatar" 
                width={100}
                height={100}
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
            )}
            <Link href="/account">
              <p className="text-xl text-gray-500">{userInfo.name || ''}</p>
            </Link>
            <p className="text-sm text-gray-500">{userInfo.email || ''}</p>
            <div className="py-8">
              <p className="text-4xl text-gray-500">{userInfo.point} pt</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center justify-center w-full mt-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <span className="mr-2">🔓</span>ログアウト
          </button>

          <div className="mt-4 text-xs text-gray-400 text-center">
            <a href="#" className="hover:underline">プライバシーポリシー</a> ・ <a href="#" className="hover:underline">利用規約</a>
          </div>
        </div>
      )}
    </>
  );
};
