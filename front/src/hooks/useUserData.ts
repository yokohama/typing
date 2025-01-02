import { useEffect } from 'react';
import { fetchData } from '@/lib/api';
import { UserInfo } from '@/types/userInfo';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { useUser } from '@/context/UserContext';

export const useUserData = (endpoint: string, setFormData: (data: UserInfo) => void) => {
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
  }, [endpoint, setUserInfo, userInfo?.image, setFormData]);
};
