"use client";

import { useEffect, useState } from 'react';
import { GiftRequest } from '@/types/pair';

import { Table, 
  Thead, TheadTr, 
  Tbody, TbodyTr, 
  Th, Td 
} from '@/components/Table';

import { FormatDateTime } from '@/lib/format';
import { MobileTable } from '@/components/MobileTable';

export const GiftRequestTable = ({
  giftRequests,
} : {
  giftRequests: GiftRequest[],
}) => {

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


  return(
    <>
      <div className="hidden md:block">
        <Table>
          <Thead>
            <TheadTr>
              <Th>申請日</Th>
              <Th>状態</Th>
              <Th>ニックネーム</Th>
              <Th>コイン</Th>
              <Th>Amaonギフト</Th>
            </TheadTr>
          </Thead>
          <Tbody>
            {sortedGiftRequests.map((giftRequest) => (
              <TbodyTr key={giftRequest.id}>
                <Td>{FormatDateTime(giftRequest.created_at)}</Td>
                <Td>{printGiftRequestStatus(giftRequest)}</Td>
                <Td>{giftRequest.pair_user_name}</Td>
                <Td>{giftRequest.point}</Td>
                <Td>〇〇円分</Td>
              </TbodyTr>
            ))}
          </Tbody>
        </Table>
      </div>
      <div className="md:hidden space-y-4 mt-4">
        {sortedGiftRequests.map((giftRequest) => (
          <MobileTable key={giftRequest.id}>
            <div className="
              mb-4
              flex items-center justify-between
            ">
              <p className="text-gray-500 text-sm mb-2">
                申請日: {FormatDateTime(giftRequest.created_at)}
              </p>
              <p className="
                p-2
                text-right text-sm font-bold text-pink-500
                bg-pink-200
                rounded-lg
              ">
                {printGiftRequestStatus(giftRequest)}
              </p>
             </div>
             <div className="
               flex justify-between items-start
               text-gray-600
             ">
               <p className="text-sm">
                 {giftRequest.pair_user_name}
               </p>
               <div className='text-right'>
                 <p>
                   <span className="font-bold">{giftRequest.point}</span>
                   コイン消費
                 </p>
                 <p>
                   Amazonギフト
                   <span className="font-bold">〇〇</span>
                   円分
                 </p>
               </div>
             </div>
          </MobileTable>
        ))}
      </div>
    </>
  );
}
