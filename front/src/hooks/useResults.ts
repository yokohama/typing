import { useEffect, useState } from 'react';
import { Result } from '@/types/result';
import { fetchData } from '@/lib/api';

export const useResults = () => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/results`;

  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      const data = await fetchData(endpoint, 'GET');
      setResults(Array.isArray(data) ? data : []);
    };

    fetchResults();
  }, [endpoint]);

  return results;
};
