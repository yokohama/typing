"use client";

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
            {giftRequests.map((giftRequest) => (
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
        {giftRequests.map((giftRequest) => (
          <MobileTable key={giftRequest.id}>
            <p className="text-gray-500 text-sm mb-2">
              申請日: {FormatDateTime(giftRequest.created_at)}
            </p>
            <p className="text-lg font-bold">
              状態： {printGiftRequestStatus(giftRequest)}
            </p>
            <p className="text-lg font-bold">
              ニックネーム： {giftRequest.pair_user_name}
            </p>
            <p className="text-lg font-bold">
              コイン： {giftRequest.point}
            </p>
            <p className="text-lg font-bold">
              Amazonギフト： 〇〇円分
            </p>
          </MobileTable>
        ))}
      </div>
    </>
  );
}
