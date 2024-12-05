import { FaGift } from "react-icons/fa";

import { Relation, SelectedRelation } from '@/types/pair';
import React from "react";

export const RequestButton = ({
  relation,
  setSelectedRelation,
  setIsShowModal,
} : {
  relation: Relation,
  setSelectedRelation: React.Dispatch<React.SetStateAction<SelectedRelation | null>>,
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>,
}) => {

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

  return (
    <button
      onClick={() => handleRequestButton({
        parentUserId: relation.relation_user_id,
        parentUserName: relation.relation_user_name
      })}
      className="
    ">
      <FaGift 
        size={30}
        className="
          text-pink-500
          hover:scale-110
          hover:text-pink-600
        "
      />
    </button>
  );
}
