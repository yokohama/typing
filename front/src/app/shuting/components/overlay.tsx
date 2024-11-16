import { Result } from "@/types/result";

type OverlayProps = {
  isCorrectOverlayVisible: boolean,
  isIncorrectOverlayVisible: boolean,
  isFinishOverlayVisible: boolean,
  result: Result,
};

export default function Overlay({
  isCorrectOverlayVisible,
  isIncorrectOverlayVisible,
  isFinishOverlayVisible,
  result,
}: OverlayProps) {
  return(
    <>
      {isCorrectOverlayVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         >
          <span className="text-white text-[20rem] font-bold">〇</span>
        </div>
      )}

      {isIncorrectOverlayVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         >
          <span className="text-red text-[20rem] font-bold">×</span>
        </div>
      )}

      {isFinishOverlayVisible && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center flex-col z-50"
         >
          <div className="text-white text-[5rem] font-bold">
            FINISH
          </div>
          <div className="text-white text-[3rem] font-bold">
            スコア: {result.score}
          </div>
          <div className="text-white text-[3rem] font-bold">
            タイムボーナス: {result.time_bonus}
          </div>
        </div>
      )}
    </>
  );
}
