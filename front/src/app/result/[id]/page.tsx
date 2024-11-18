"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { fetchData } from '@/lib/api';
import { Result } from '@/types/result';
import { ResultTable } from '@/app/result/components/ResultTable';
import { Records } from '@/app/result/components/Records';
import Loading from "@/components/Loading";
import { isErrorResponse } from '@/types/errorResponse';

export default function Page() {
  const [result, setResult] = useState<Result | null>(null);
  const [records, setRecords] = useState<Result[]>([]);

  const params = useParams();
  const id = params?.id;
  const resultEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results/${id}`;
  const recordsEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/shutings/${result?.level}/results`;

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
    if (result && result?.level) {
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
    <div className="flex justify-center min-h-screen bg-gray-50">
      <main className="w-full max-w-3xl bg-white p-6">
        {result ? (
          <div>
            <h1 className="text-center text-3xl font-bold mb-6">
              Level{result.level}
            </h1>
            <Records records={records} />
            <div className="mb-4" />
            <ResultTable result={result} />
            <div className="mb-4" />
            <Link 
              href={`/shuting/${result.level}`}
              className="block mx-auto text-center px-6 py-2 bg-orange-600 text-white font-semibold rounded hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 w-fit"
            >チャレンジ</Link>
          </div>
        ): (
          <Loading />
        )}
      </main>
    </div>
  );
}
