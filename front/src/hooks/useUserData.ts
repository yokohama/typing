import { useEffect } from 'react';
import { fetchData, patchData } from '@/lib/api';
import { UserInfo } from '@/types/userInfo';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { useUser } from '@/context/UserContext';

type ValidationError = {
  [key: string]: string[];
};

export const useUserData = (
  setFormData: (data: UserInfo) => void,
  formData: UserInfo,
  setErrors: (errors: ValidationError) => void,
  clearErrors: () => void,
  setIsUpdated: (isUpdated: boolean) => void,
  endpoint: string
) => {
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
  }, [endpoint, setFormData, setUserInfo, userInfo?.image]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await patchData<UserInfo, UserInfo | ErrorResponse>(endpoint, formData);

      if (isErrorResponse(data) && data.error_type === 'ValidationError') {
        const errors = data.details ? JSON.parse(data.details) : {};
        setErrors(errors);
      } else if (!isErrorResponse(data)) {
        setUserInfo({
          ...data,
          image: userInfo?.image
        });
        setFormData(data);
        clearErrors();

        setIsUpdated(true);
        setTimeout(() => {
          setIsUpdated(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };
  return { handleChange, handleSubmit };
};
