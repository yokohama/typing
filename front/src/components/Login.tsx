'use client';

import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

import { useUser } from '@/context/UserContext';

import Popup from '@/components/Popup';

export default function Login() {
  const { data: session } = useSession();
  const { userInfo } = useUser();
  const [ isOpen, setIsOpen ] = useState(false);

  if (session) {
    return(
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-16 h-16 
            rounded-full 
            overflow-hidden 
            focus:outline-none 
            hover:ring-4 hover:ring-pink-400 
            transform transition-transform duration-200 
            focus:scale-110 
            hover:scale-110 
            active:scale-105
          ">
          <Image 
            src={userInfo.image || "/images/default-avatar.png"} 
            width={100}
            height={100}
            alt="User Avatar" 
            className="w-full h-full object-cover"
          />
        </button>

        <Popup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    );
  }

  return (
    <button 
      onClick={() => signIn('google')}
      className="
        px-4 py-2 
        bg-blue-600 
        text-white 
        rounded-md 
        hover:bg-blue-700
    ">Sign in with Google</button>
  );
}
