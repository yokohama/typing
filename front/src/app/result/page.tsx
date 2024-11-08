"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { ResultData } from '@/types/result';
import { fetchData } from '@/lib/api';
import { FormatTime } from '@/lib/format';
import Loading from '@/components/Loading';

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results`;

  const [resultsData, setResultsData] = useState<ResultData[]>([]);

  useEffect(() => {
    const fetchResultsData = async () => {
      const data = await fetchData(endpoint, 'GET');
      setResultsData(Array.isArray(data) ? data : []);
    };

    fetchResultsData();
  }, []);

  return(
    <div>
      {resultsData ? (
        resultsData.map((result, index) => (
	  <Link href={`/result/${result.id}`} key={index}>
            <div className="bg-white border border-gray-200 shadow-md rounded-lg p-4 mb-4 hover:bg-gray-50 transition-all duration-200 ease-in-out">
              <p className="text-gray-500 text-sm">
                {new Date(result.created_at).toLocaleDateString()}
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{result.lesson_title}</h3>
              <div className="flex items-center justify-between mt-3">
                <p className="text-blue-600 font-bold text-lg">Score: {result.score}</p>
                <p className="text-blue-600 font-bold text-lg">{FormatTime(result.time)}</p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <Loading />
      )}
    </div>
  );
};
