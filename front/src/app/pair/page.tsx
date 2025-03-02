"use client";
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { QrCode } from './components/QrCode';
import { PairTable } from '@/app/pair/components/PairTable';
import { GiftRequest } from '@/app/pair/components/GiftRequest';
import { SelectedRelation } from '@/types/pair';
import { usePairRelations } from '@/hooks/usePairRelations';
import { useInvitationUrl } from '@/hooks/useInvitationUrl';

export default function Page() {
  const { userInfo } = useUser();
  const { relations, isLoading, error } = usePairRelations();
  const invitationUrl = useInvitationUrl(userInfo);

  const [isShowModal, setIsShowModal] = useState(false);
  const [selectedRelation, setSelectedRelation] = useState<SelectedRelation | null>(null);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      {isShowModal && selectedRelation ? (
        <GiftRequest
          parentUserId={selectedRelation.parentUserId}
          parentUserName={selectedRelation.parentUserName}
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
        />
      ) : (
        <>
          <QrCode invitationUrl={invitationUrl} />
          <PairTable
            relations={relations}
            setSelectedRelation={setSelectedRelation}
            setIsShowModal={setIsShowModal}
          />
        </>
      )}
    </>
  );
}
