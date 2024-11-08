import { ResultTableProps } from "@/types/result";
import { FormatTime } from "@/lib/format";

export const ResultTable: React.FC<ResultTableProps> = ({ result }) => (
  <table className="table-auto w-full border-collapse">
    <tbody>
      <tr>
        <td className="border px-4 py-2 font-semibold">日時</td>
        <td className="border px-4 py-2">
          {new Date(result.created_at).toLocaleDateString()}
        </td>
      </tr>
      <tr>
        <td className="border px-4 py-2 font-semibold">Score</td>
        <td className="border px-4 py-2">{result.score}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2 font-semibold">Time</td>
        <td className="border px-4 py-2">{FormatTime(result.time)}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2 font-semibold">問題</td>
        <td className="border px-4 py-2">{result.lesson_example}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2 font-semibold">回答</td>
        <td className="border px-4 py-2">{result.answer}</td>
      </tr>
    </tbody>
  </table>
);
