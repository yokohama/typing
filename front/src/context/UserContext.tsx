import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  ReactNode 
} from "react";

import { useSession, signOut } from 'next-auth/react';

import { fetchData } from '@/lib/api';
import { UserInfo } from "@/types/userInfo";
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';

type UserContextType = {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
  isJwtAvailable: boolean;
  setIsJwtAvailable: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const handleGoogleAccessTokenError = (errorMsg: string) => {
  localStorage.clear();
  signOut({ callbackUrl: '/google-accesstoken-error' })
  console.error(errorMsg);
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    name: "",
    image: "",
    point: 0,
  });
  const [isJwtAvailable, setIsJwtAvailable] = useState<boolean>(false);

  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/api/auth/google`;
  const profileEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/profile`;

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleToken: session?.accessToken,
        }),
      }).then(jwtRes => {
        jwtRes.json().then((jwtData: { jwt: string }) => {
          localStorage.setItem('jwt', jwtData.jwt);
          setIsJwtAvailable(true);

          fetchData<UserInfo | ErrorResponse>(
            profileEndpoint, 
            'GET'
          ).then((userRes) => {

            if (isErrorResponse(userRes)) {
              console.error('Error fetching user data:', userRes.message);
              return;
            }

            setUserInfo((prev) => ({
              ...prev,
              email: userRes.email || '',
              name: userRes.name || '',
              image: session?.user?.image || '',
              point: userRes.point || 0,
            }));
          });
        }).catch(error => {
          handleGoogleAccessTokenError(error.message);
        });
      })
    }
  }, [ session, status ]);

  return (
    <UserContext.Provider value={{ 
      userInfo, 
      setUserInfo, 
      isJwtAvailable,
      setIsJwtAvailable,
    }}>
      {children}
    </UserContext.Provider>
  );
};  

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
