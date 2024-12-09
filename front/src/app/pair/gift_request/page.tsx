"use client";

import React, { useEffect, useState } from 'react';
import { FaHeart, FaYenSign } from "react-icons/fa"

import { fetchData } from '@/lib/api';

import { GiftRequestTable } from '@/app/pair/components/GiftRequestTable';

import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { GiftRequests, GiftRequest } from '@/types/pair';

export default function GiftRequestPage() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/gift_requests`;

enum RequestType {
  forParents = "ちょうだい！",
  fromChildren = "あげる",
};

  const [
    giftRequests, 
    setGiftRequests
  ] = useState<GiftRequests | null>(null);
  const [
    myParentsGiftRequests, 
    setMyParentsGiftRequests
  ] = useState<GiftRequest[]>([]);
  const [
    myChildrenGiftRequests, 
    setMyChildrenGiftRequests
  ] = useState<GiftRequest[]>([]);

  const [selectedTab, setSelectedTab] = useState<RequestType.forParents | RequestType.fromChildren>(RequestType.forParents);

  useEffect(() => {
    const fetchShutingsData = async () => {
      const data = await fetchData<GiftRequests | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching shutings data:', data.message);
        return;
      }

      setGiftRequests(data);
    };

    fetchShutingsData();
  }, []);

  useEffect(() => {
    setMyParentsGiftRequests(giftRequests?.myParents || []);
    setMyChildrenGiftRequests(giftRequests?.myChildren || []);
  }, [giftRequests])

  return(
    <>
      <div className="flex mb-4">
        <div className="
          w-full mb-4 gap-x-2
          flex justify-center
          border-b-2 border-yellow-400
        ">
          <button
            className={`
              px-4 py-2 
              rounded-t-xl 
              transform transition
              flex items-center gap-x-2 flex-nowrap
              ${
                selectedTab === RequestType.forParents 
                  ? "bg-yellow-400 text-white font-bold scale-110"
                  : "bg-gray-200 text-gray-600 scall-100"
              }`
            }
            onClick={() => setSelectedTab(RequestType.forParents)}
          >
            <FaHeart size={20} />
            <span>{RequestType.forParents}</span>
          </button>
          <button
            className={`
              px-4 py-2 
              rounded-t-xl 
              transform transition
              flex items-center gap-x-2 flex-nowrap
              ${
                selectedTab === RequestType.fromChildren 
                  ? "bg-yellow-400 text-white font-bold scale-110"
                  : "bg-gray-200 text-gray-600 scall-100"
              }`
            }
            onClick={() => setSelectedTab(RequestType.fromChildren)}
          >
            <FaYenSign size={20} />
            <span>{RequestType.fromChildren}</span>
          </button>
        </div>
      </div>

      {selectedTab === RequestType.forParents && myParentsGiftRequests &&
        <GiftRequestTable giftRequests={myParentsGiftRequests} />
      }

      {selectedTab === RequestType.fromChildren && myParentsGiftRequests &&
        <GiftRequestTable giftRequests={myChildrenGiftRequests} />
      }
    </>
  );
}
