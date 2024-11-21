'use client';

import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useState } from 'react';

import { useUser } from '@/context/UserContext';

import Popup from '@/components/Popup';

export default function Login() {

  const googleIcon = "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg";

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
         flex items-center justify-center
         px-2 py-2 sm:px-4
         bg-white 
         text-gray-600 
         font-bold
         shadow
         rounded-md 
         hover:bg-gray-100
    ">
       <img 
         src={googleIcon}
         alt="Google logo" 
         className="h-4 sm:h-5 w-4 sm:w-5 mr-2" 
       />
       Sign in
    </button>
  );
}
