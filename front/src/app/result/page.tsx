"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { Result } from '@/types/result';
import { fetchData } from '@/lib/api';
import Loading from '@/components/Loading';

import { ResultTable } from '@/app/result/components/ResultTable';

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results`;

  const [results, setResults] = useState<Result[]>([]);
  const [sortedResults, setSortedResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await fetchData(endpoint, 'GET');
      setResults(Array.isArray(data) ? data : []);
    };

    fetchResults();
  }, [endpoint]);

  useEffect(() => {
    setSortedResults(
      results
        ?.filter((result) => result.created_at !== undefined)
        .sort((a, b) =>
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        )
    );
  }, [results]);

  return(
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">レコード</h1>
        <Link
          href="/players"
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm" >
          ランキングを見る
        </Link>
      </div>

      {sortedResults ? (
        <ResultTable sortedResults={sortedResults} />
      ) : (
        <Loading />
      )}
    </div>
  );
};
