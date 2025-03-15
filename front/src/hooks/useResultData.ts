import { useEffect } from 'react';
import { fetchData } from '@/lib/api';
import { Result } from '@/types/result';
import { isErrorResponse } from '@/types/errorResponse';

export const useResultData = (
  resultEndpoint: string,
  recordsEndpoint: string,
  setResult: React.Dispatch<React.SetStateAction<Result | null>>,
  setRecords: React.Dispatch<React.SetStateAction<Result[]>>,
  result: Result | null
) => {
  // 結果データを取得するuseEffect
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
  }, [resultEndpoint, setResult]);

  // 履歴データを取得するuseEffect
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
  }, [result, recordsEndpoint, setRecords]);
};
