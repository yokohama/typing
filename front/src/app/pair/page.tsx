"use client";

import React, { useEffect, useState } from 'react';

import { QRCodeCanvas } from 'qrcode.react';

import { fetchData } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import { ErrorResponse, isErrorResponse } from '@/types/errorResponse';
import { FormatDateTime } from '@/lib/format';
import { 
  Table, 
  Thead,
  TheadTr,
  Tbody,
  TbodyTr,
  Th, 
  Td,
} from '@/components/Table';


type Relation = {
  relation_type: string,
  relation_user_id: number,
  relation_user_name: string,
  created_at: Date,
};

/*
 * TODO:
 * user_idで招待をしてしまっているので、IDoor問題あり。
 * user_idではなく、都度APIをたたいてトークンをparents_childrenに生成。
 * 有効期限もつけ、有効な間だけここに表示。
 */
export default function Page() {
  const endpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/pairs`;
  const frontUrl = `${process.env.NEXT_PUBLIC_FRONT_URL}`;
  
  const { userInfo } = useUser();
  const [relations, setRelations] = useState<Relation[]>([]);
  const [invitationUrl, setInvitationUrl] = useState<string | undefined | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await fetchData<Relation[] | ErrorResponse>(endpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching user data:', data.message);
        return;
      }

      setRelations(data);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (userInfo) {
      setInvitationUrl(`${frontUrl}/invitation?inviteChildUserId=${userInfo?.id}`);
    }
  }, [userInfo]);

  return(
    <>
      <div className="text-center">
        <p>パパやママにQRコードを教えて、たまったコインでお小遣いをもらおう！</p>
        <div className="my-4 flex justify-center">
          {invitationUrl && (
            <QRCodeCanvas
              value={invitationUrl}
              size={150}
              bgColor="#ffffff"
              fgColor="#000000"
            />
          )}
        </div>
        <p>{invitationUrl}</p>
      </div>
      <Table>
        <Thead>
          <TheadTr>
            <Th>作成日</Th>
            <Th>関連</Th>
            <Th>ニックネーム</Th>
          </TheadTr>
        </Thead>
        <Tbody>
          {relations.map((relation, index) => (
            <TbodyTr key={index}>
              <Td>{FormatDateTime(relation.created_at)}</Td>
              <Td>{relation.relation_type}</Td>
              <Td>{relation.relation_user_name}</Td>
            </TbodyTr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
