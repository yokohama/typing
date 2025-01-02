import { useState, useEffect } from "react";

import { useAlert } from "@/context/AlertContext";

import { GiftRequest } from "@/types/pair";
import { isErrorResponse } from '@/types/errorResponse';

import { patchData } from "@/lib/api";
import { formatToNaiveDateTime } from "@/lib/format";

export const useGiftRequestTable = (giftRequests: GiftRequest[]) => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/gift_requests`;

  const { setAlerts } = useAlert();

  const [isShowModal, setIsShowModal] = useState<boolean>(false);

  const printGiftRequestStatus = (giftRequest: GiftRequest) => {
    if (giftRequest.approved_at) { return "支払済" };
    if (giftRequest.rejected_at) { return "却下" };
    return "お願い中";
  }

  const [
    sortedGiftRequests, 
    setSortedGiftRequests
  ] = useState<GiftRequest[]>([]);

  useEffect(() => {
    setSortedGiftRequests(
      giftRequests
        ?.filter((request) => request.created_at !== undefined)
        .sort((a, b) => 
          new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
        )
    );
  }, [giftRequests]);

  const [selectedGiftRequest, setSelectedGiftRequest] = useState<GiftRequest | null>(null);

  const handleOnClick = (giftRequest: GiftRequest) => {
    setSelectedGiftRequest(prev => ({
      ...prev,
      ...giftRequest,
    }));

    setIsShowModal(true);
  };

  const handleAccept = async (status: string) => {
    setIsShowModal(false);

    const updatedGiftRequest = {
      ...selectedGiftRequest,
      approved_at: status === "approved" ? formatToNaiveDateTime(new Date()) : selectedGiftRequest?.approved_at,
      rejected_at: status === "rejected" ? formatToNaiveDateTime(new Date()) : selectedGiftRequest?.rejected_at,
    };

    const data: GiftRequest = await patchData(endpoint, updatedGiftRequest);

    if (isErrorResponse(data)) {
      setAlerts(prev => [
        ...prev,
        {
          type: "error",
          msg: "決済に失敗しました。",
        },
      ]);
      return;
    }

    setAlerts(prev => [
      ...prev,
      {
        type: "success",
        msg: "支払いに成功しました。",
      },
    ]);
  };

  return {
    isShowModal,
    setIsShowModal,
    printGiftRequestStatus,
    sortedGiftRequests,
    handleOnClick,
    handleAccept,
  };
};
