import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  ReactNode 
} from "react";

import { UserInfo } from "@/types/userInfo";





import { useSession, signOut } from 'next-auth/react';
import { fetchData } from '@/lib/api';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';





type UserContextType = {
  userInfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: "",
    name: "",
    image: "",
    point: 0,
  });

  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/api/auth/google`;
  const profileEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/profile`;

  const getJwtByGoogleAccessToken = async () => {
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
        signOut({ callbackUrl: '/google-accesstoken-error' })
        const errorText = await response.text();
        throw new Error(errorText || 'Unknown error occurred');
      }

      const jwtData: { jwt: string } = await response.json();
      localStorage.setItem('jwt', jwtData.jwt);
    }
  };

  const getUserInfo = async () => {
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
        image: session?.user?.image || '',
        point: data.point || 0,
      }));
    }
  }

  useEffect(() => {
    if (status === 'authenticated' && session?.accessToken) {
      getJwtByGoogleAccessToken();
      getUserInfo();
    }

  }, [ session, status ]);

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
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
