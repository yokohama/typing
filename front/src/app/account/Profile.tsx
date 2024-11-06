"use client";

import React, { useEffect, useState } from 'react';
import { fetchData, postData } from '@/lib/api';
import { useValidation } from '@/hooks/useValidation';

type UserData = {
  email: string;
  name: string;
};

export default function Page() {
  const endpoint = 'http://localhost:3000/user/profile';

  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<UserData>({
    email: '',
    name: '',
  });

  const { validationErrors, setErrors, clearErrors } = useValidation();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchData(endpoint, 'GET');
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
      const data = await postData(endpoint, formData);
      if (data.error_type === 'ValidationError') {
	const errors = JSON.parse(data.details);
        setErrors(errors);
      } else {
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
        <h1>Profile</h1>

        {validationErrors && (
          <div className="error-messages">
            {Object.entries(validationErrors).map(([field, messages]) => (
              <p key={field}>
                {field}: {messages.join(", ")}
              </p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div>
            Email: {userData.email}
          </div>
          <div>
            <label htmlFor="name">Name:</label>
            {validationErrors?.name && (<p>{validationErrors?.name}</p>)}
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }

  return null;
}
