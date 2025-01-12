import { useEffect } from 'react';
import { fetchData } from '@/lib/api';
import { UserInfo } from '@/types/userInfo';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { useUser } from '@/context/UserContext';

export const useUserData = (setFormData: (data: UserInfo) => void) => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/profile`;
  const { userInfo, setUserInfo } = useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchData<UserInfo | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching user data:', data.message);
        return;
      }

      setUserInfo({
        ...data,
        image: userInfo?.image
      });
      setFormData(data);
    };

    fetchUserData();
  }, [setUserInfo, userInfo?.image]);

  return { endpoint, setFormData };
};
