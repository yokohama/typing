import { ReactNode } from "react";
import { Result } from "@/types/result";
import { FormatSecTime, FormatDateTime } from "@/lib/format";

export const Description = ({
  result
} : {
  result: Result
}) => (
  <>
    <div className="
      text-2xl
      text-center
      text-gray-600
      font-bold
    ">{result.created_at && FormatDateTime(result.created_at)}</div>

    <div className="
      mb-6
      border-4 border-yellow-300 
      rounded-xl overflow-hidden
    ">
      <table className="
        min-w-full bg-white
        border-collapse
      ">
        <tbody>
          <tr>
            <Th>獲得コイン</Th>
            <Td>{result.gain_coin}</Td>
          </tr>
          <tr>
            <Th>スコア</Th>
            <Td>{result.score}</Td>
          </tr>
          <tr>
            <Th>所要時間</Th>
            <Td>{FormatSecTime((result.completion_time ?? 0))}</Td>
          </tr>
          <tr>
            <Th>パーフェクト</Th>
            <Td>{result.perfect_within_correct_count}</Td>
          </tr>
          <tr>
            <Th>正解</Th>
            <Td>{result.correct_count}</Td>
          </tr>
          <tr>
            <Th>失敗</Th>
            <Td>{result.incorrect_count}</Td>
          </tr>
        </tbody>
      </table>
    </div>
  </>
);

const Th = ({
  children,
} : {
  children?: ReactNode,
}) => {
  return (
    <td className="
      py-3 px-6 
      text-lg
      font-semibold 
      bg-yellow-200 
      text-gray-600 
      leding-normal 
      border border-b-yellow-400 border-r-yellow-400
    ">{children}</td>
  );
}

const Td = ({
  children,
} : {
  children?: ReactNode,
}) => {
  return (
    <td className="
      px-4 py-2
      text-xl
      text-center
      border 
      border border-b-yellow-400
    ">{children}</td>
  );
}
