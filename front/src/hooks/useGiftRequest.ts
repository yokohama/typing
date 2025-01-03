import { useState, useEffect } from "react";

import { useAlert } from "@/context/AlertContext";

import { GiftRequests, GiftRequest } from "@/types/pair";
import { isErrorResponse, ErrorResponse } from '@/types/errorResponse';

import { patchData, fetchData } from "@/lib/api";
import { formatToNaiveDateTime } from "@/lib/format";

enum RequestType {
  forParents = "ちょうだい！",
  fromChildren = "あげる",
};

export const useGiftRequest = () => {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/gift_requests`;

  const { setAlerts } = useAlert();
  const [isShowModal, setIsShowModal] = useState<boolean>(false);

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

  const [
    selectedTab, 
    setSelectedTab
  ] = useState<RequestType.forParents | RequestType.fromChildren>(RequestType.forParents);

  useEffect(() => {
    const fetchGiftRequestsData = async () => {
      const data = await fetchData<GiftRequests | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching shutings data:', data.message);
        return;
      }

      setGiftRequests(data);
    };

    fetchGiftRequestsData();
  }, []);

  useEffect(() => {
    setMyParentsGiftRequests(giftRequests?.myParents || []);
    setMyChildrenGiftRequests(giftRequests?.myChildren || []);
  }, [giftRequests])

  const printGiftRequestStatus = (giftRequest: GiftRequest) => {
    if (giftRequest.approved_at) { return "支払済" };
    if (giftRequest.rejected_at) { return "却下" };
    return "お願い中";
  }

  const getHandleOnClick = (giftRequest: GiftRequest) => {
    if (printGiftRequestStatus(giftRequest) === "お願い中") {
      return { handleOnClick: () => handleOnClick(giftRequest) };
    }
    return {};
  }

  const [
    selectedSortedGiftRequests, 
    setSelectedSortedGiftRequests
  ] = useState<GiftRequest[]>([]);

  useEffect(() => {
    const sourceGiftRequests = 
      selectedTab === RequestType.forParents
        ? myParentsGiftRequests
        : myChildrenGiftRequests

    const sortedGiftRequests = sourceGiftRequests
      ?.filter((request) => request.created_at !== undefined)
      .sort((a, b) => 
        new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
      );

    setSelectedSortedGiftRequests(sortedGiftRequests);
  }, [selectedTab]);

  const [
    selectedGiftRequest, 
    setSelectedGiftRequest
  ] = useState<GiftRequest | null>(null);

  const handleOnClick = (giftRequest: GiftRequest) => {
    setSelectedGiftRequest(prev => ({
      ...prev,
      ...giftRequest,
    }));

    setIsShowModal(true);
  };

  const handleAccept = async (status: string) => {
    setIsShowModal(false);

    const now = formatToNaiveDateTime(new Date());
    const approved_at = selectedGiftRequest?.approved_at;
    const rejected_at = selectedGiftRequest?.rejected_at;

    const updatedGiftRequest = {
      ...selectedGiftRequest,
      approved_at: status === "approved" ? now : approved_at,
      rejected_at: status === "rejected" ? now : rejected_at
    };

    try {
      const data: GiftRequests = await patchData(endpoint, updatedGiftRequest);

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

      setGiftRequests(data);

      setAlerts(prev => [
        ...prev,
        {
          type: "success",
          msg: "支払いに成功しました。",
        },
      ]);
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return {
    isShowModal,
    setIsShowModal,
    printGiftRequestStatus,
    getHandleOnClick,
    selectedSortedGiftRequests, 
    handleAccept,
    selectedTab,
    setSelectedTab,
  };
};
