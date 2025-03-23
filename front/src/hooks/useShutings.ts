import { useEffect } from 'react';
import { fetchData } from '@/lib/api';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { Shuting } from '@/types/shuting';

export const useShutings = (
  endpoint: string,
  setShutings: React.Dispatch<React.SetStateAction<Shuting[]>>
) => {
  useEffect(() => {
    const fetchShutingsData = async () => {
      const data = await fetchData<Shuting[] | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching shutings data:', data.message);
        return;
      }

      setShutings(data);
    };

    fetchShutingsData();
  }, [endpoint, setShutings]);
};
