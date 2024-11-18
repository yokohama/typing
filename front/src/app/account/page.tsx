"use client";

import React, { useEffect, useState } from 'react';
import { fetchData, postData } from '@/lib/api';
import { useValidation } from '@/hooks/useValidation';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';

import { useUser } from '@/context/UserContext';
import { UserInfo } from '@/types/userInfo';

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/profile`;

  const { userInfo, setUserInfo } = useUser();
  const [formData, setFormData] = useState<UserInfo>({
    email: '',
    name: '',
    point: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => setIsEditing(true);

  const { validationErrors, setErrors, clearErrors } = useValidation();
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchData<UserInfo | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching user data:', data.message);
        return;
      }

      setUserInfo({
        ...data,
        image: userInfo.image
      });
      setFormData(data);
    };

    fetchUserData();
  }, [endpoint]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await postData<UserInfo, UserInfo | ErrorResponse>(endpoint, formData);

      if (isErrorResponse(data) && data.error_type === 'ValidationError') {
        const errors = data.details ? JSON.parse(data.details) : {};
        setErrors(errors);
      } else if (!isErrorResponse(data)) {
        setUserInfo({
          ...data,
          image: userInfo.image
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

  if (userInfo) {
    return(
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">プロフィール</h1>
        {isUpdated && (
          <div className="bg-green-400 text-white py-2 px-4 rounded-lg shadow-lg mb-4">
            保存しました。
          </div>
        )}

        {validationErrors && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {Object.entries(validationErrors).map(([field, messages]) => (
              <p key={field} className="text-sm">
                <strong>{field}:</strong> {messages.join(", ")}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-gray-700">
            <label className="font-semibold">メールアドレス:</label>
            <p className="ml-2 text-gray-600">{userInfo.email}</p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-semibold">ニックネーム:</label>

            {isEditing ? (
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                onBlur={() => setIsEditing(false)} 
                autoFocus
                className="
                  mt-1 p-2 border border-gray-300 rounded 
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                "
              />
            ) : (
              <p
                onClick={handleEditClick}
                className="
                  mt-1 p-2 
                  border border-transparent rounded
                  bg-gray-100
                  hover:bg-gray-200 cursor-pointer
                ">{formData.name || "Click to edit"}</p>
            )}   
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
	    保存
          </button>
        </form>
      </div>
    );
  }

  return null;
}
