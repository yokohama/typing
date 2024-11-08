"use client"

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

import { fetchData } from '@/lib/api';
import { ResultData } from '@/types/result';
import { ResultTable } from '@/app/result/components/ResultTable';
import { Records } from '@/app/result/components/Records';
import Loading from "@/components/Loading";

export default function Page() {
  const [result, setResult] = useState<ResultData | null>(null);
  const [records, setRecords] = useState<ResultData[]>([]);

  const params = useParams();
  const id = params?.id;
  const resultEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results/${id}`;
  const recordsEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results?lesson_id=${result?.lesson_id}`;

  useEffect(() => {
    const fetchResultData = async () => {
      const data = await fetchData(resultEndpoint, 'GET');
      setResult(data);
    };

    fetchResultData();
  }, []);

  useEffect(() => {
    if (result && result.lesson_id) {
      const fetchRecordsData = async () => {
        const data = await fetchData(recordsEndpoint, 'GET');
        setRecords(data);
      };

      fetchRecordsData();
    }
  }, [result]);

  return (
    <div className="flex justify-center min-h-screen bg-gray-50">
      <main className="w-full max-w-3xl bg-white p-6">
        {result ? (
          <div>
            <h1 className="text-center text-3xl font-bold mb-6">
              {result.lesson_title}
            </h1>
            <Records records={records} />
            <div className="mb-4" />
            <ResultTable result={result} />
            <div className="mb-4" />
            <Link 
              href={`/lesson/${result.lesson_id}`}
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
