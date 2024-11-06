'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function Login() {
  const { data: session, status } = useSession();

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
      <div>
        <p>{session.user.email}</p>
        <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
      </div>
    );
  }
  return <button onClick={() => signIn('google')}>Sign in with Google</button>;
}
