import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaGift } from "react-icons/fa";

import { useConfig } from "@/context/ConfigContext";
import { useAlert } from "@/context/AlertContext";
import { useUser } from "@/context/UserContext";

import { postData } from "@/lib/api";
import { isErrorResponse } from '@/types/errorResponse';

import { Modal } from "@/components/Modal";

import { UserInfo } from "@/types/userInfo";

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

  const router = useRouter();

  const { setAlerts } = useAlert();
  const { userInfo, setUserInfo } = useUser();
  const { config } = useConfig();

  const [giftRequest, setGiftRequest] = useState<GiftRequest | null>(null);
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (userInfo?.id) {
      setGiftRequest({
        parent_user_id: parentUserId,
        child_user_id: userInfo.id,
        point: 0,
      });
    }
  }, []);

/*
  const giftRequestCoinStep: number = parseInt(
    config.find(item => "GIFT_REQUEST_COIN_STEP" in item)!["GIFT_REQUEST_COIN_STEP"],
    10
  );
  */

  const giftRequestCoinStep = (): number => {
    if (!config) {
      return 0;
    }

    return parseInt(
      config.find(item => "GIFT_REQUEST_COIN_STEP" in item)!["GIFT_REQUEST_COIN_STEP"],
      10
    );
  }

  const handleChangePoint = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setGiftRequest(prev => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        point: value,
      };
    });

    if (!value) {
      setIsSendButtonDisabled(true);
    } else if (value <= 0) {
      setIsSendButtonDisabled(true);
    } else if (value % giftRequestCoinStep() === 0) {
      setIsSendButtonDisabled(false);
    } else {
      setIsSendButtonDisabled(true);
    }
  }

  const handleSendButton = async () => {
    try {
      const data: UserInfo = await postData(endpoint, giftRequest);

      if (isErrorResponse(data)) {
        setGiftRequest(null);
        setIsShowModal(false);
        setAlerts(prev => [
          ...prev,
          {
            type: "error",
            msg: "お願いに失敗しました。"
          }
        ]);
        return;
      }

      setGiftRequest(null);
      setIsShowModal(false);

      setUserInfo({
        id: data.id,
        point: data.point,
        total_point: data.total_point,
      });

      setAlerts(prev => [
        ...prev,
        {
          type: "success",
          msg: `${parentUserName}さんにお願いをしました！`
        }
      ]);

      router.push("/pair/gift_request");


    } catch (error) {
      console.error("API error: " + error);
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
          さんにAmazonポイントに交換してもらいたいコインの数を入力してね。
        </p>
        <p className="text-center text-sm">
          ※ {giftRequestCoinStep()}コイン単位で交換できます。
        </p>
        <div className="mb-4 flex items-center space-x-2">
          <input
            type="number"
            min={0}
            max={userInfo?.point}
            step={giftRequestCoinStep()}
            autoFocus
            defaultValue={0}
            onChange={handleChangePoint}
            className="
              text-4xl font-bold
              text-center
              flex-grow
              p-2
              border border-gray-300
              rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500
          "/>
          <p className="
            text-xl
          "> / {userInfo?.point}コイン</p>
        </div>
        <div className="flex justify-center">
          <button 
            onClick={handleSendButton}
            disabled={isSendButtonDisabled}
            className={`
              px-4 py-2
              text-white
              font-bold
              rounded-md
              shadow-md
              ${
                isSendButtonDisabled
                  ? 'bg-gray-400 cursor-not-allowd'
                  : 'bg-pink-400 hover:bg-pink-500'
              }
           `}>お願いする</button>
        </div>
    </Modal>
  );
};
