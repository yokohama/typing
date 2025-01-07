"use client";

import React, { useState } from 'react';
import { patchData } from '@/lib/api';
import { useValidation } from '@/hooks/useValidation';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';

import { useUser } from '@/context/UserContext';
import { UserInfo } from '@/types/userInfo';
import { BasicButton } from '@/components/Button';
import { Label } from '@/app/account/components/Lable';
import { useUserData } from '@/hooks/useUserData';

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/profile`;

  const { userInfo, setUserInfo } = useUser();
  const [formData, setFormData] = useState<UserInfo>({
    id: null,
    email: '',
    name: '',
    point: 0,
    total_point: 0,
  });

  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => setIsEditing(true);

  const { validationErrors, setErrors, clearErrors } = useValidation();
  const [isUpdated, setIsUpdated] = useState(false);

  useUserData(endpoint, setFormData);

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

  if (userInfo) {
    return(
      <div>
        {isUpdated && (
          <div className="
            py-2 px-4 
            mb-4
            bg-green-400
            text-white
            rounded-lg shadow-lg
          ">保存しました。</div>
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
            <Label text="メールアドレス" />
            <p className="ml-2 text-gray-600">{userInfo.email}</p>
          </div>

          <div className="flex flex-col">
            <Label text="ニックネーム" />

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
                  mt-1 p-2
                  border border-gray-300 
                  rounded 
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-400
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
            <div className="mb-8" />
          </div>

          <BasicButton text="保存" type="submit" />
        </form>
      </div>
    );
  }

  return null;
}
