'use client';

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
      }
    };

    sendTokenBackend();
  }, [session, status]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (status === 'authenticated') {
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

    getUserInfo();
  }, [status]);

  if (session) {
    return(
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 focus:outline-none">
          <img src={userInfo.image || "/default-avatar.png"} alt="User Avatar" className="w-full h-full- object-cover" />
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
