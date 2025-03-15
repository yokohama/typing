"use client"

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

import { Result } from '@/types/result';
import { Description } from '@/app/result/components/Description';
import { Chart } from '@/app/result/components/Chart';
import Loading from "@/components/Loading";
import { BasicButton } from "@/components/Button";
import { useResultData } from '@/hooks/useResultData';

export default function Page() {
  const [result, setResult] = useState<Result | null>(null);
  const [records, setRecords] = useState<Result[]>([]);

  const params = useParams();
  const id = params?.id;
  const resultEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results/${id}`;
  const recordsEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/shutings/${result?.shuting_id}/results`;

  useResultData(
    resultEndpoint,
    recordsEndpoint,
    setResult,
    setRecords,
    result
  );

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
          <Description result={result} />
          <BasicButton
             text='チャレンジ'
            url={`/shuting/${result.shuting_id}`}
          />
        </div>
      ): (
        <Loading />
      )}
    </div>
  );
}
