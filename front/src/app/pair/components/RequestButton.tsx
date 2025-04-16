import { FaGift } from "react-icons/fa";

import { Relation, SelectedRelation } from '@/types/pair';
import React from "react";

import { useUser } from "@/context/UserContext";

export const RequestButton = ({
  relation,
  setSelectedRelation,
  setIsShowModal,
} : {
  relation: Relation,
  setSelectedRelation: React.Dispatch<React.SetStateAction<SelectedRelation | null>>,
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

  const { userInfo } = useUser();

  const handleRequestButton = ({
    parentUserId,
    parentUserName,
  } : {
    parentUserId: number
    parentUserName: string,
  }) => {
    setSelectedRelation({
      parentUserId: parentUserId,
      parentUserName: parentUserName,
    });
    setIsShowModal(true);
  };

  if (relation.relation_type === 'child') {
    return null;
  }

  const isPointAvailable = (): boolean => {
    return userInfo !== null && userInfo.coin > 0;
  };

  return (
    <button
      onClick={() => {
        if (isPointAvailable()) {
          handleRequestButton({
            parentUserId: relation.relation_user_id,
            parentUserName: relation.relation_user_name
          });
        }
      }}
      disabled={!isPointAvailable()}
      className="
    ">
      <FaGift 
        size={30}
        className={`
          ${isPointAvailable() ? 'text-pink-500' : 'text-gray-500'}
          ${isPointAvailable() && 'hover:scale-110'}
          ${isPointAvailable() && 'hover:text-pink-600'}
        `}
      />
    </button>
  );
}
