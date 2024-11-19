import React from "react";
import Link from "next/link";
import Image from "next/image";

import { signOut } from 'next-auth/react';

import { useUser } from '@/context/UserContext';
import { UserInfo } from "@/types/userInfo";

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
        <div 
          className="
            absolute
            p-4 z-50
            right-0 mt-2 py-12 w-64
            bg-gray-100 border border-gray-200
            rounded-xl shadow-lg
        ">
          <CloseButton setIsOpen={setIsOpen} />
          <UserInfoArea
            setIsOpen={setIsOpen}
            userInfo={userInfo}
          />
          <EditButton setIsOpen={setIsOpen} />
          <LogoutButton />
          <FooterArea />
        </div>
      )}
    </>
  );
};

const CloseButton = ({
  setIsOpen,
} : {
  setIsOpen: (isOpen: boolean) => void
}) => {
  return (
    <button 
      onClick={() => setIsOpen(false)} 
      className="
        absolute top-2 right-4
        text-gray-400
        text-2xl font-bold
        hover:text-gray-600
      ">&times;</button>
  )
}

const UserInfoArea = ({
  setIsOpen,
  userInfo,
} : {
  setIsOpen: (isOpen: boolean) => void,
  userInfo: UserInfo,
}) => {
  return(
    <Link href="/account">
      <div 
        onClick={() => {setIsOpen(false)}}
        className="flex flex-col items-center text-center"
      >
        {userInfo.image && (
          <Image 
            src={userInfo.image || "/images/default-avatar.png"} 
            alt="User Avatar" 
            width={100}
            height={100}
            className="w-16 h-16 rounded-full object-cover mb-2"
          />
        )}
        <p className="text-xl text-gray-500">{userInfo.name || ''}</p>
        <p className="text-sm text-gray-500">{userInfo.email || ''}</p>
        <div className="py-8">
          <p className="text-4xl text-gray-500">{userInfo.point} pt</p>
        </div>
      </div>
    </Link>
  )
}

const EditButton = ({ 
  setIsOpen 
} : {
  setIsOpen: (isOpen: boolean) => void
}) => {
  return(
    <Link href="/account">
      <button 
        onClick={() => {setIsOpen(false)}}
        className="
          px-4 py-2 
          w-full
          bg-green-500
          text-white font-semibold rounded
          hover:bg-green-600
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-offset-2
      ">編集</button>
    </Link>
  )
}

const LogoutButton = () => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/push-logout-button' })}
      className="
        flex
        items-center
        justify-center 
        w-full mt-4 py-2 
        bg-gray-200 text-gray-600 rounded-lg 
        hover:bg-gray-300 transition-colors
      ">
      <span className="mr-2">🔓</span>ログアウト
    </button>
  )
}

const FooterArea = () => {
  return(
    <div className="mt-4 text-xs text-gray-400 text-center">
      <a href="#" className="hover:underline">プライバシーポリシー</a>
      ・
      <a href="#" className="hover:underline">利用規約</a>
    </div>
  )
}
