import { ResultTableProps } from "@/types/result";
import { FormatSecTime, FormatDateTime } from "@/lib/format";

export const ResultTable: React.FC<ResultTableProps> = ({ result }) => (
  <table className="table-auto w-full border-collapse">
    <tbody>
      <tr>
        <td className="border px-4 py-2 font-semibold">日時</td>
        <td className="border px-4 py-2">
          {FormatDateTime(result.created_at)}
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 font-semibold">スコア</td>
        <td className="border px-4 py-2">{result.score}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2 font-semibold">タイムボーナス</td>
        <td className="border px-4 py-2">{result.time_bonus}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2 font-semibold">合計スコア</td>
        <td className="border px-4 py-2">
          {result.score + result.time_bonus}
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 font-semibold">経過時間</td>
        <td className="border px-4 py-2">{FormatSecTime(result.time)}</td>
      </tr>
    </tbody>
  </table>
);
