"use client"

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Result } from '@/types/result';
import { fetchData } from '@/lib/api';
import { FormatSecTime, FormatDateTime } from '@/lib/format';
import Loading from '@/components/Loading';

export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results`;

  const [results, setResults] = useState<Result[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      const data = await fetchData(endpoint, 'GET');
      setResults(Array.isArray(data) ? data : []);
    };

    fetchResults();
  }, [endpoint]);

  const sortedResults = results
    ?.filter((result) => result.created_at ! == undefined)
    .sort((a, b) => 
      new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
    );

  return(
    <div className="overflow-x-auto my-6 p-4">
      {sortedResults ? (
        <div 
          className="
            border-4 border-yellow-300 
            rounded-xl overflow-hidden
        ">
          <table className="
            min-w-full bg-white
            border-collapse
          ">
            <thead>
              <tr 
                className="
                  text-sm
                  bg-yellow-200 
                  text-gray-600
                  leading-normal
              ">
                <Th></Th>
                <Th>レベル</Th>
                <Th>スコア</Th>
                <Th>タイムボーナス</Th>
                <Th>タイム</Th>
                <Th>コイン</Th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {results.map((result, index) => (
                <tr 
                  key={index}
                  onClick={() => router.push(`/result/${result.id}`)}
                  className="
                    text-center
                    border-b border-gray-200 
                    hover:bg-red-100
                ">
                  <Td>
                    {result.created_at && FormatDateTime(result.created_at)}
                  </Td>
                  <Td>{result.shuting_id}</Td>
                  <Td>{result.score}</Td>
                  <Td>{result.time_bonus}</Td>
                  <Td>{result.time && FormatSecTime(result.time)}</Td>
                  <Td>{result.point}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

const Th = ({
  children,
} : {
  children?: ReactNode
}) => {
  return (
    <td className="py-3 px-6 font-bold">{children}</td>
  );
}

const Td = ({
  children,
} : {
  children?: ReactNode
}) => {
  return (
    <td className="py-3 px-6">{children}</td>
  );
}
