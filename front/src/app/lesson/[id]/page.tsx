"use client"

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from "next/navigation";
import { useValidation } from '@/hooks/useValidation';

import { LessonData, FormData } from '@/types/lesson';
import { fetchData, postData } from '@/lib/api';
import { FormatTime } from '@/lib/format';

type ErrorResponse = {
  message?: string;
  error_type?: string;
  details?: string;
};

function isErrorResponse(data: unknown): data is ErrorResponse {
  return typeof data === 'object' && data !== null && ('message' in data || 'error_type' in data);
}

export default function Page() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const getEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/lessons/${id}`;
  const postEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/lessons/${id}/results`;

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [formData, setFormData] = useState<FormData>({ answer: '', time: 0});

  const [time, setTime] = useState<number>(0);
  const [isTiming, setIsTiming] = useState<boolean>(false);

  const { setErrors, clearErrors } = useValidation();

  useEffect(() => {
    const fetchLessonData = async () => {
      const data = await fetchData(getEndpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching lesson data:', data.message);
	setErrors({ lesson: [data.message || 'An error occurred'] });
	return;
      };

      setLessonData(data as LessonData);
      clearErrors();
    };

    fetchLessonData();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isTiming) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isTiming && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isTiming]);

  const handleStart = () => {
    setTime(0);
    setIsTiming(true);
  };

  const handleStop = () => {
    setIsTiming(false);
  }

  const setInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, answer: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleStop();

    const updateFormData = { ...formData, time };

    try {
      const data = await postData(postEndpoint, updateFormData);

      if (isErrorResponse(data)) {
        if (data.error_type === 'ValidationError') {
	  const errors = data.details ? JSON.parse(data.details) : {};
	  setErrors(errors);
	} else {
	  console.error('API Error:', data.message);
	}
      } else if (data && 'id' in data) {
        clearErrors();
        router.push(`/result/${data.id}`);
      }
    } catch (error) {
      console.error('Error create result:', error);
    }
  }; 

  return(
    <div className="flex justify-center min-h-screen bg-gray-50">
      <main className="w-full max-w-3xl bg-white p-6">
        <h1 
          className="text-2xl font-semibold text-gray-800 mb-4 text-center"
        >{lessonData?.title}</h1>

        <div className="flex justify-center mb-4">
          <div className="text-4xl font-blod text-blue-600 bg-gray-100 rounded-lg p-4">
            {FormatTime(time)}
          </div>
        </div>
        
        <div 
          className="max-w-3xl bg-gray-100 p-8"
        >{lessonData?.example}</div>

        <div className="mb-4" />
          
        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={formData.answer}
            onChange={setInput}
            onFocus={handleStart}
            className="p-8 border border-gray-300 rounded w-full maz-w-md mb-4"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >送信</button>
        </form>
      </main>
    </div>
  );
}
