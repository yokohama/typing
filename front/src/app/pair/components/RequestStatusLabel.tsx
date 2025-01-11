import { RequestStatus } from "@/types/pair"

const statusClass = {
  [RequestStatus.request]: "text-pink-500 bg-pink-200",
  [RequestStatus.approved]: "text-green-500 bg-green-200",
  [RequestStatus.rejected]: "text-gray-500 bg-gray-200",
  undefined: "text-gray-500 bg-white",
}

export const RequestStatusLabel = ({
  status
} : {
  status?: RequestStatus
}) => {
  return (
    <div>
      <p className={`
        p-2
        text-sm font-bold rounded-lg
        ${statusClass[status ?? "undefined"]}
      `}>
        {status ?? ""}
      </p>
    </div>
  );
}
