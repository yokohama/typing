"use client";

import React, { useEffect, useState } from 'react';
import { fetchData, postData } from '@/lib/api';
import { useValidation } from '@/hooks/useValidation';

type UserData = {
  email: string;
  name: string;
};

type ErrorResponse = {
  message?: string;
  error_type?: string;
  details?: string;
}

function isErrorResponse(data: unknown): data is ErrorResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    ('message' in data || 'error_type' in data)
  );
}

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/profile`;

  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    email: '',
    name: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const handleEditClick = () => setIsEditing(true);

  const { validationErrors, setErrors, clearErrors } = useValidation();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchData<UserData | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching user data:', data.message);
        return;
      }

      setUserData(data);
      setFormData({
        email: data.email || '',
        name: data.name || '',
      });
    };

    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value || '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await postData<UserData, UserData | ErrorResponse>(endpoint, formData);

      if (isErrorResponse(data) && data.error_type === 'ValidationError') {
	const errors = data.details ? JSON.parse(data.details) : {};
        setErrors(errors);
      } else if (!isErrorResponse(data)) {
        setUserData(data);
        setFormData(data);
	clearErrors();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (userData) {
    return(
      <div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Profile</h1>

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
            <label className="font-semibold">Email:</label>
            <p className="ml-2 text-gray-600">{userData.email}</p>
          </div>

          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 font-semibold">Name:</label>

            {isEditing ? (
              <>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onBlur={() => setIsEditing(false)} 
                  autoFocus
                />
              </>
            ) : (
              <p
                className="mt-1 p-2 border border-transparent rounded hover:bg-gray-100 cursor-pointer"
                onClick={handleEditClick}
              >
                {formData.name || "Click to edit"}
              </p>
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
