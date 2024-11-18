import { ResultTableProps } from "@/types/result";
import { FormatSecTime, FormatDateTime } from "@/lib/format";

export const ResultTable: React.FC<ResultTableProps> = ({ result }) => (
  <div className="overflow-x-auto">
    <table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-md">
      <tbody>
        <tr className="odd:bg-white even:bg-gray-100">
          <td className="border px-4 py-2 font-semibold">日時</td>
          <td className="border px-4 py-2">
            {result.created_at && FormatDateTime(result.created_at)}
          </td>
        </tr>
        <tr className="odd:bg-white even:bg-gray-100">
          <td className="border px-4 py-2 font-semibold">スコア</td>
          <td className="border px-4 py-2">{result.score}</td>
        </tr>
        <tr className="odd:bg-white even:bg-gray-100">
          <td className="border px-4 py-2 font-semibold">タイムボーナス</td>
          <td className="border px-4 py-2">{result.time_bonus}</td>
        </tr>
        <tr className="odd:bg-white even:bg-gray-100">
          <td className="border px-4 py-2 font-semibold">合計スコア</td>
          <td className="border px-4 py-2">
            {(result.score ?? 0) + (result.time_bonus ?? 0)}
          </td>
        </tr>
        <tr className="odd:bg-white even:bg-gray-100">
          <td className="border px-4 py-2 font-semibold">詳細</td>
          <td className="border px-4 py-2">
            <p>所要時間: {FormatSecTime((result.time ?? 0))}</p>
            <p>パーフェクト: {result.perfect_count}</p>
            <p>正解: {result.correct_count}</p>
            <p>失敗: {result.incorrect_count}</p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
