import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect,
  ReactNode 
} from "react";
import { useRouter } from "next/navigation";

import { useSession, signOut } from 'next-auth/react';

import { fetchData, postData } from '@/lib/api';
import { UserInfo } from "@/types/userInfo";
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { useAlert } from "@/context/AlertContext";

type UserContextType = {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
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
  const router = useRouter();
  const { setAlerts } = useAlert();

  const { data: session, status } = useSession();
  const [ userInfo, setUserInfo ] = useState<UserInfo | null>(null);
  const [ isJwtAvailable, setIsJwtAvailable ] = useState<boolean>(false);

  //const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/api/auth/google`;
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/auth/google`;
  const profileEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/profile`;
  const pairEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/pairs`;

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
              id: userRes.id || null,
              email: userRes.email || '',
              name: userRes.name || '',
              image: session?.user?.image || '',
              point: userRes.point || 0,
              total_point: userRes.point || 0,
            }));
          });
        }).catch(error => {
          handleGoogleAccessTokenError(error.message);
        });
      })
    }
  }, [session, status]);

  // Create pair if from invitation link
  useEffect(() => {
    const createPair = async (inviteChildUserId: number) => {
      try {
        const res = await postData(
          pairEndpoint, 
          {
            parent_user_id: userInfo?.id,
            child_user_id: inviteChildUserId,
          }
        );

        if (isErrorResponse(res) && res.message) {
          // You can debug => `res.message`
          sessionStorage.removeItem("inviteChildUserId");
          router.push('/invitation/exist');
        } else {
          setAlerts(prev => [
            ...prev,
            {
              type: "success",
              msg: "親子の関連付けに成功しました。"
            }
          ]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const inviteChildUserId = sessionStorage.getItem("inviteChildUserId");
    if (userInfo && inviteChildUserId) {
      createPair(parseInt(inviteChildUserId, 10));
    };
  }, [userInfo]);

  return (
    <UserContext.Provider value={{ 
      userInfo, 
      setUserInfo, 
      isJwtAvailable,
      setIsJwtAvailable,
    }}>{children}</UserContext.Provider>
  );
};  

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
