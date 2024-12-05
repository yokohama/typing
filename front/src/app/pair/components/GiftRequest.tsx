import React, { useEffect } from "react";
import { useState } from "react";
import { FaGift } from "react-icons/fa";

import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";

import { postData } from "@/lib/api";
import { isErrorResponse } from '@/types/errorResponse';

import { Modal } from "@/components/Modal";

type GiftRequest = {
  parent_user_id: number,
  child_user_id: number,
  point: number,
}

export const GiftRequest = ({
  parentUserId,
  parentUserName,
  isShowModal,
  setIsShowModal,
} : {
  parentUserId: number,
  parentUserName: string,
  isShowModal: boolean,
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/gift_requests`;

  const { setAlerts } = useAlert();
  const { userInfo } = useUser();

  const [giftRequest, setGiftRequest] = useState<GiftRequest | null>(null);

  useEffect(() => {
    userInfo?.id && setGiftRequest({
      parent_user_id: parentUserId,
      child_user_id: userInfo.id,
      point: 0,
    });
  }, []);

  const handleChangePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setGiftRequest(prev => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        point: value,
      };
    });
  }

  const handleSendButton = async () => {
    try {
      const data: GiftRequest = await postData(endpoint, giftRequest);

      if (isErrorResponse(data)) {
        console.error('API Error:', data.message);
        return;
      }

      setGiftRequest(null);
      setIsShowModal(false);
      setAlerts(prev => [
        ...prev,
        {
          type: "success",
          msg: `${parentUserName}さんにお願いをしました！`
        }
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      isShowModal={isShowModal}
      setIsShowModal={setIsShowModal}
      >
        <div className="
          flex justify-center items-center
          mt-8
        ">
          <FaGift 
            size={100}
            className="text-pink-300"
          />
        </div>
        <p className="
          mt-8 mb-4
          text-lg
          text-center
        ">
          <span className="font-bold">
            {userInfo?.point}コイン
          </span>
          たまってるよ！
          <span className="font-bold">
            {parentUserName}
          </span>
          さんにAmazonポイントに交換してもらいたいコインの数を入力してね
        </p>
        <div className="mb-4">
          <input
            type="number"
            min={0}
            max={userInfo?.point}
            step={10}
            autoFocus
            defaultValue={0}
            onChange={handleChangePoint}
            className="
              text-4xl font-bold
              text-center
              w-full
              p-2
              border border-gray-300
              rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500
          "/>
        </div>
        <div className="flex justify-center">
          <button 
            onClick={handleSendButton}
            className="
              px-4 py-2
              bg-pink-400
              text-white
              font-bold
              rounded-md
              shadow-md
              hover:bg-pink-500
           ">お願いする</button>
        </div>
    </Modal>
  );
};
