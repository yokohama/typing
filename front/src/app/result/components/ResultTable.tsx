import { useRouter } from 'next/navigation';

import { FormatDateTime, FormatSecTime } from '@/lib/format';

import { Result } from '@/types/result';

import { 
  Table,
  Thead, TheadTr,
  Tbody, TbodyTr,
  Th, Td,
} from "@/components/Table";
import { MobileTable } from '@/components/MobileTable';

export const ResultTable = ({
  sortedResults,
}
: {
  sortedResults: Result[],
}) => {
  const router = useRouter();

  return(
    <div>
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <Thead>
            <TheadTr>
              <Th></Th>
              <Th>レベル</Th>
              <Th>スコア</Th>
              <Th>タイム</Th>
              <Th>コイン</Th>
            </TheadTr>
          </Thead>
          <Tbody>
            {sortedResults.map((result, index) => (
              <TbodyTr
                key={index}
                handleOnClick={() => router.push(`/result/${result.id}`)}
              >
                <Td>{result.created_at && FormatDateTime(result.created_at)}</Td>
                <Td>{result.shuting_id}</Td>
                <Td>{result.score}</Td>
                <Td>{result.completion_time && FormatSecTime(result.completion_time)}</Td>
                <Td>{result.gain_coin}</Td>
              </TbodyTr>
            ))}
          </Tbody>
        </Table>
      </div>
      <div className="md:hidden space-y-4">
        {sortedResults.map((result, index) => (
          <MobileTable
            key={index}
            handleOnClick={() => router.push(`/result/${result.id}`)}
          >
            <p className="text-gray-500 text-sm mb-2">
              作成日: {result.created_at && FormatDateTime(result.created_at)}
            </p>
            <p className="text-lg font-bold">
              レベル: {result.shuting_id}
            </p>
            <p className="text-lg font-bold">
              スコア: {result.score}
            </p>
            <p>タイム: {result.completion_time && FormatSecTime(result.completion_time)}</p>
            <p>コイン: {result.gain_coin}</p>
          </MobileTable>
        ))}
      </div>
    </div>
  );
};
