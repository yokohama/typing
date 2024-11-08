"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { LessonData } from '@/types/lesson';
import { fetchData } from '@/lib/api';
import Loading from '@/components/Loading';

type LessonsData = LessonData[];

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/lessons`;

  const [lessonsData, setLessonsData] = useState<LessonsData>([]);

  useEffect(() => {
    const fetchLessonsData = async () => {
      const data = await fetchData(endpoint, 'GET');
      setLessonsData(Array.isArray(data) ? data : []);
    };

    fetchLessonsData();
  }, []);

  return(
    <>
      <div>
        {lessonsData ? (
          lessonsData.map((lesson) => (
            <Link href={`/lesson/${lesson.id}`} key={lesson.id} >
              <div
                className="bg-red-50 mb-4 p-2 h-16 rounded hover:bg-red-100 transition-all duration-200 ease-in-out">
                <p>{lesson.title}</p>
              </div>
            </Link>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
}
