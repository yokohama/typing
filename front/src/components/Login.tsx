'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { useUser } from '@/context/UserContext';

import Popup from '@/components/Popup';
import { GoogleSignInButton } from './GoogleSignInButton';

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
            w-12 h-12 sm:w-16 sm:h-16
            rounded-full 
            overflow-hidden 
            focus:outline-none 
            transform transition-transform duration-200 
            focus:scale-110 
            hover:scale-110 
            hover:ring-4 hover:ring-orange-500 
            active:scale-105
          ">
          <Image 
            src={userInfo?.image || "/images/default-avatar.png"} 
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
    <GoogleSignInButton />
  );
}
