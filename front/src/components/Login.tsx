'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Login() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetch('http://localhost:3000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: session.accessToken,
        }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Unknown error occurred');
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem('jwt', data.jwt);
        })
        .catch((error) => {
          console.error('Error sending token to Rust backend:', error);
        });
    }
  }, [session, status]);


  if (session) {
    return(
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 focus:outline-none">
          <img src={session.user?.image || "/default-avatar.png"} alt="User Avatar" className="w-full h-full- object-cover" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-100 border border-gray-200 rounded-xl shadow-lg p-4">
            <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
              &times;
            </button>

            <div className="flex flex-col items-center text-center">
              <img src={session.user.image || "/default-avatar.png"} alt="User Avatar" className="w-16 h-16 rounded-full object-cover mb-2" />
              <p className="text-sm text-gray-500">{session.user.email}</p>
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
