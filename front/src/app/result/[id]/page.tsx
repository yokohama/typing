"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { fetchData } from '@/lib/api';
import { Result } from '@/types/result';
import { ResultTable } from '@/app/result/components/ResultTable';
import { Chart } from '@/app/result/components/Chart';
import Loading from "@/components/Loading";
import { isErrorResponse } from '@/types/errorResponse';

export default function Page() {
  const [result, setResult] = useState<Result | null>(null);
  const [records, setRecords] = useState<Result[]>([]);

  const params = useParams();
  const id = params?.id;
  const resultEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results/${id}`;
  const recordsEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/shutings/${result?.shuting_id}/results`;

  useEffect(() => {
    const fetchResult = async () => {
      const data = await fetchData(resultEndpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching result data:', data.message);
	return;
      }

      setResult(data as Result);
    };

    fetchResult();
  }, [resultEndpoint]);

  useEffect(() => {
    if (result && result?.shuting_id) {
      const fetchRecords = async () => {
        const data = await fetchData(recordsEndpoint, 'GET');

        if (Array.isArray(data) && data.every(item => !isErrorResponse(item))) {
          setRecords(data);
        } else {
          console.error('Error fetching records data');
        }
      };

      fetchRecords();
    }
  }, [result, recordsEndpoint]);

  return (
    <div className="justify-center min-h-screen">
      {result ? (
        <div>
          <h1 className="
            text-2xl
            font-bold
            text-center
            text-gray-600
          ">レベル{result.shuting_id}</h1>
          <Chart records={records} />
          <ResultTable result={result} />
          <ChallengeButton shuting_id={result.shuting_id} />
        </div>
      ): (
        <Loading />
      )}
    </div>
  );
}

const ChallengeButton = ({
  shuting_id
} : {
  shuting_id: number
}) => {
  return (
    <Link 
      href={`/shuting/${shuting_id}`}
      className="
        flex items-center justify-center mx-auto
        w-full lg:w-80
        h-12 lg:h-16
        px-6 py-2
        rounded-lg
        text-xl
        bg-pink-400 text-white font-semibold 
        hover:bg-pink-500
        hover:scale-110
        focus:outline-none
        focus:ring-2
        focus:ring-pink-500
        focus:ring-offset-2 w-fit
    ">チャレンジ</Link>
  )
}
