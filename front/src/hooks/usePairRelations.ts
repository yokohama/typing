import { useState, useEffect } from 'react';
import { fetchData } from '@/lib/api';
import { Relation } from '@/types/pair';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';

export const usePairRelations = () => {
  const [relations, setRelations] = useState<Relation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/pairs`;

  useEffect(() => {
    const fetchRelations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchData<Relation[] | ErrorResponse>(endpoint, 'GET');

        if (isErrorResponse(data)) {
          setError(data.message || data.error_type || 'Unknown error');
          return;
        }

        setRelations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelations();
  }, []);

  return { relations, isLoading, error };
};
