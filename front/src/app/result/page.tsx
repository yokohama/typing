"use client"

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Result } from '@/types/result';
import { fetchData } from '@/lib/api';
import { FormatSecTime, FormatDateTime } from '@/lib/format';
import Loading from '@/components/Loading';
import { 
  Table, 
  Thead,
  TheadTr,
  Tbody,
  TbodyTr,
  Th, 
  Td,
} from '@/components/Table';

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
        <Table>
          <Thead>
            <TheadTr>
              <Th></Th>
              <Th>レベル</Th>
              <Th>スコア</Th>
              <Th>タイムボーナス</Th>
              <Th>タイム</Th>
              <Th>コイン</Th>
            </TheadTr>
          </Thead>
          <Tbody>
            {results.map((result, index) => (
              <TbodyTr
                key={index}
                handleOnClick={() => router.push(`/result/${result.id}`)}
              >
                <Td>
                  {result.created_at && FormatDateTime(result.created_at)}
                </Td>
                <Td>{result.shuting_id}</Td>
                <Td>{result.score}</Td>
                <Td>{result.time_bonus}</Td>
                <Td>{result.time && FormatSecTime(result.time)}</Td>
                <Td>{result.point}</Td>
              </TbodyTr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Loading />
      )}
    </div>
  );
};
