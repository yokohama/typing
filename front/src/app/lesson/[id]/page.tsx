"use client"

import React, { 
  useEffect, 
  useState, 
  useRef,
  ChangeEvent,
  FormEvent
} from 'react';
import { useParams, useRouter } from "next/navigation";
import { useValidation } from '@/hooks/useValidation';

import { LessonData, FormData } from '@/types/lesson';
import { fetchData, postData } from '@/lib/api';
import { FormatTime } from '@/lib/format';
import { isErrorResponse } from '@/types/errorResponse';

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
  const [matchLength, setMatchLength] = useState<number>(0);

  const { setErrors, clearErrors } = useValidation();

  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const playSound = () => {
    const audio = new Audio('/sounds/success2.mp3');
    audio.play();
  };

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

  useEffect(() => {
    if (!lessonData?.example) return;

    let newMatchLength = 0;

    for (let i = 0; i < formData.answer.length; i++) {
      if (formData.answer[i] === lessonData.example[i]) {
        newMatchLength++;
      } else {
        break;
      }
    }

    if (newMatchLength !== matchLength) {
      setMatchLength(newMatchLength);
      if (newMatchLength > matchLength) {
        playSound();
      }
    }

  }, [formData.answer, lessonData?.example, matchLength]);

  const handleStart = () => {
    setTime(0);
    setIsTiming(true);

    if (bgmRef.current) {
      bgmRef.current.loop = true;
      bgmRef.current.play();
    }
  };

  const handleStop = () => {
    setIsTiming(false);

    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
  }

  const setInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prevData) => ({ ...prevData, answer: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

  const renderExampleWithHighlight = () => {
    if (!lessonData?.example) return null;

    const matchingText = lessonData.example.slice(0, matchLength);
    const remainingText = lessonData.example.slice(matchLength);

    return (
      <span>
        <span 
          className="text-green-600 font-bold" 
          dangerouslySetInnerHTML={{ __html: matchingText.replace(/\n/g, "<br />") }} 
        />
        <span 
          dangerouslySetInnerHTML={{ __html: remainingText.replace(/\n/g, "<br />") }} />
      </span>
    );
  };

  return(
    <div className="flex justify-center min-h-screen bg-gray-50">
      <main className="w-full max-w-5xl bg-white p-6">
        <h1 
          className="text-2xl font-semibold text-gray-800 mb-4 text-center"
        >{lessonData?.title}</h1>

        <div className="flex justify-center mb-4">
          <div className="text-4xl font-bold text-blue-600 bg-gray-100 rounded-lg p-4">
            {FormatTime(time)}
          </div>
        </div>
        
        <div className="flex space-x-4">
          <div 
            id="exampleArea"
            className="w-1/2 bg-gray-100 p-8 rounded"
          >
            {renderExampleWithHighlight()}
          </div>

          <div 
            id="formArea"
            className="w-1/2">
            <form
              className="flex flex-col items-center"
              onSubmit={handleSubmit}
            >
              <textarea
                value={formData.answer}
                onChange={setInput}
                onFocus={handleStart}
                rows={4}
                className="p-8 border border-gray-300 rounded w-full maz-w-md mb-4"
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >送信</button>
            </form>
          </div>
        </div>
        <audio ref={bgmRef} src='/sounds/bgm.mp3' />
      </main>
    </div>
  );
}
