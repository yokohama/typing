"use client";

import { FaHeart, FaYenSign } from "react-icons/fa"
import { FormatDateTime } from '@/lib/format';

import { useGiftRequest } from "@/hooks/useGiftRequest";
import { Modal } from "@/components/Modal";
import { MobileTable } from '@/components/MobileTable';
import { 
  Table, 
  Thead, TheadTr, 
  Tbody, TbodyTr, 
  Th, Td 
} from '@/components/Table';
import { SelectGroup } from '@/app/pair/components/SelectGroup';

import { RequestStatus, RequestType } from '@/types/pair';
import { RequestStatusLabel } from "../components/RequestStatusLabel";

export default function GiftRequestPage() {

  const { 
    selectedTab,
    setSelectedTab,
    isShowModal,
    setIsShowModal,
    handleSelectedGroup,
    handleAccept,
    getHandleOnClick,
    filterdGiftRequests
  } = useGiftRequest();

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

      <div className="hidden md:block">
        <div className="flex justify-end items-center mb-4 mr-6">
          <SelectGroup handleSelectedGroup={handleSelectedGroup} />
        </div>
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
            {filterdGiftRequests.map((giftRequest) => (
              <TbodyTr 
                key={giftRequest.id} 
                {
                  ...(
                    selectedTab === RequestType.fromChildren 
                     ? getHandleOnClick(giftRequest) : {}
                  )
                }
              >
                <Td>{FormatDateTime(giftRequest.created_at)}</Td>
                <Td>
                  <RequestStatusLabel status={giftRequest.requestStatus} />
                </Td>
                <Td>{giftRequest.pair_user_name}</Td>
                <Td>{giftRequest.coin}</Td>
                <Td>〇〇円分</Td>
              </TbodyTr>
            ))}
          </Tbody>
        </Table>
      </div>

      <div className="md:hidden space-y-4 mt-4">
        <div className="flex justify-end items-center mb-4">
          <SelectGroup handleSelectedGroup={handleSelectedGroup} />
        </div>
        {
          /* 
           * TODO: onClick出来ないレコードは、
           * マウスオーバー時に背景をグレーに 
           */}
        {filterdGiftRequests.map((giftRequest) => (
          <MobileTable 
            key={giftRequest.id}
            {...getHandleOnClick(giftRequest)}
          >
            <div className="
              mb-4
              flex items-center justify-between
            ">
              <p className="text-gray-500 text-sm mb-2">
                申請日: {FormatDateTime(giftRequest.created_at)}
              </p>
              <RequestStatusLabel status={giftRequest.requestStatus} />
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
                   <span className="font-bold">{giftRequest.coin}</span>
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

      {isShowModal && (
        <Modal
          isShowModal={isShowModal}
          setIsShowModal={setIsShowModal}
        >
          <div className="
            mt-8
            space-y-4
            flex flex-col
            justify-center items-center 
            w-full
          ">
            <button 
              onClick={() => handleAccept(RequestStatus.approved)}
              className="
                px-4 py-8
                text-2xl font-bold
                text-gray-700 bg-yellow-300
                rounded-md
                w-full
              ">あげる</button>
            <button 
              onClick={() => handleAccept(RequestStatus.rejected)}
              className="
                px-4 py-4
                text-lg font-bold
                text-gray-700 bg-red-300
                rounded-md
                w-full
              ">キャンセル</button>
          </div>
        </Modal>
      )}
    </>
  );
}
