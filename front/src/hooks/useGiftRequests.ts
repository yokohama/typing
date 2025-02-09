import { useEffect, useState } from 'react';
import { fetchData } from '@/lib/api';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { GiftRequests, GiftRequest } from '@/types/pair';

export const useGiftRequests = () => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/gift_requests`;
  const [giftRequests, setGiftRequests] = useState<GiftRequests | null>(null);
  const [myParentsGiftRequests, setMyParentsGiftRequests] = useState<GiftRequest[]>([]);
  const [myChildrenGiftRequests, setMyChildrenGiftRequests] = useState<GiftRequest[]>([]);

  useEffect(() => {
    const fetchGiftRequestsData = async () => {
      const data = await fetchData<GiftRequests | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching gift requests data:', data.message);
        return;
      }

      setGiftRequests(data);
    };

    fetchGiftRequestsData();
  }, []);

  useEffect(() => {
    setMyParentsGiftRequests(giftRequests?.myParents || []);
    setMyChildrenGiftRequests(giftRequests?.myChildren || []);
  }, [giftRequests]);

  return {
    myParentsGiftRequests,
    myChildrenGiftRequests
  };
};
