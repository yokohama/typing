'use client';

import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { useUser } from '@/context/UserContext';

import { UserInfo } from '@/types/userInfo';
import Popup from '@/components/Popup';
import { fetchData } from '@/lib/api';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';

export default function Login() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/api/auth/google`;
  const profileEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/profile`;

  const { data: session, status } = useSession();
  const { userInfo, setUserInfo } = useUser();
  const [ isOpen, setIsOpen ] = useState(false);

  useEffect(() => {
    const sendTokenBackend = async () => {
      if (status === 'authenticated' && session?.accessToken) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            googleToken: session.accessToken,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || 'Unknown error occurred');
        }

        const jwtData: { jwt: string } = await response.json();
        localStorage.setItem('jwt', jwtData.jwt);

        const data = await fetchData<UserInfo | ErrorResponse>(profileEndpoint, 'GET');

        if (isErrorResponse(data)) {
          console.error('Error fetching user data:', data.message);
          return;
        }

        if (data) {
          setUserInfo((prev) => ({
            ...prev,
            email: data.email || '',
            name: data.name || '',
            image: session.user?.image || '',
            point: data.point || 0,
          }));
        }
      } 
    };

    sendTokenBackend();
  }, [
    session, 
    status, 
    endpoint, 
    profileEndpoint,
    setUserInfo,
  ]);

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
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
      Sign in with Google
    </button>
  );
}
