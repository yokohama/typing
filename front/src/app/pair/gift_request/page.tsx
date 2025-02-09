"use client";

import React, { useState } from 'react';
import { FaHeart, FaYenSign } from "react-icons/fa"
import { GiftRequestTable } from '@/app/pair/components/GiftRequestTable';
import { useGiftRequests } from '@/hooks/useGiftRequests';

export default function GiftRequestPage() {
  enum RequestType {
    forParents = "ちょうだい！",
    fromChildren = "あげる",
  };

  const { myParentsGiftRequests, myChildrenGiftRequests } = useGiftRequests();
  const [selectedTab, setSelectedTab] = useState<RequestType.forParents | RequestType.fromChildren>(RequestType.forParents);

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
