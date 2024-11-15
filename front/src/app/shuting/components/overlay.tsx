import { ResultData } from "@/types/result";

type OverlayProps = {
  isCorrectOverlayVisible: boolean,
  isIncorrectOverlayVisible: boolean,
  isFinishOverlayVisible: boolean,
  resultData: ResultData,
};

export default function Overlay({
  isCorrectOverlayVisible,
  isIncorrectOverlayVisible,
  isFinishOverlayVisible,
  resultData,
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
            スコア: {resultData.score}
          </div>
          <div className="text-white text-[3rem] font-bold">
            タイムボーナス: {resultData.time_bonus}
          </div>
        </div>
      )}
    </>
  );
}
