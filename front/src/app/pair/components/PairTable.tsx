import { FormatDateTime } from "@/lib/format";
import {
  Table,
  Thead, TheadTr,
  Tbody, TbodyTr,
  Th, Td
} from "@/components/Table";
import { MobileTable } from '@/components/MobileTable';
import { RequestButton } from "@/app/pair/components/RequestButton";

import { Relation, SelectedRelation } from '@/types/pair';

export const PairTable = ({
  relations,
  setSelectedRelation,
  setIsShowModal,
} : {
  relations: Relation[]; 
  setSelectedRelation: React.Dispatch<React.SetStateAction<SelectedRelation | null>>;
  setIsShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  return (
    <>
      <div className="hidden md:block">
        <Table>
          <Thead>
            <TheadTr>
              <Th>作成日</Th>
              <Th>関連</Th>
              <Th>ニックネーム</Th>
              <Th></Th>
            </TheadTr>
          </Thead>
          <Tbody>
            {relations.map((relation, index) => (
              <TbodyTr key={index}>
                <Td>{FormatDateTime(relation.created_at)}</Td>
                <Td>{relation.relation_type}</Td>
                <Td>{relation.relation_user_name}</Td>
                <Td>
                  <RequestButton
                    relation={relation}
                    setIsShowModal={setIsShowModal}
                    setSelectedRelation={setSelectedRelation}
                  />
                </Td>
              </TbodyTr>
            ))}
          </Tbody>
        </Table>
      </div>
      <div className="md:hidden space-y-4 mt-4">
        {relations.map((relation, index) => (
          <MobileTable key={index}>
            <p className="text-gray-500 text-sm mb-2">
              作成日: {FormatDateTime(relation.created_at)}
            </p>
            <p className="text-lg font-bold">
              関連： {relation.relation_type}
            </p>
            <p className="text-lg font-bold">
              ニックネーム: {relation.relation_user_name}
            </p>
            <div className="relative">
              <div className="
                absolute
                bottom-12
                right-2
              ">
              <RequestButton
                relation={relation}
                setIsShowModal={setIsShowModal}
                setSelectedRelation={setSelectedRelation}
              />
              </div>
            </div>
          </MobileTable>
        ))};
      </div>
    </>
  );
}
