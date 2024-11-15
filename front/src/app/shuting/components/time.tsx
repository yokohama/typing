import { FormatSecTime } from "@/lib/format";

interface TimeProps {
  time: number;
};

export default function Time({ time }: TimeProps) {
  return(
    <div 
      className="text-center text-3xl font-semibold mb-4"
    >
      {FormatSecTime(time)}
    </div>
  );
}
