import { Result } from "@/types/result";

type OverlayProps = {
  isCorrectOverlayVisible: boolean,
  isIncorrectOverlayVisible: boolean,
  isFinishOverlayVisible: boolean,
  isPerfectOverlayVisible: boolean,
  result: Result,
};

export default function Overlay({
  isCorrectOverlayVisible,
  isIncorrectOverlayVisible,
  isFinishOverlayVisible,
  isPerfectOverlayVisible,
  result,
}: OverlayProps) {
  return(
    <>
      {isCorrectOverlayVisible && (
        <OverlayVisible>
          <span className="
            text-[10rem] lg:text-[20rem]
            text-white font-bold
          ">〇</span>
        </OverlayVisible>
      )}

      {isPerfectOverlayVisible && (
        <OverlayVisible>
          <span className="
            text-6xl lg:text-[10rem]
            text-white font-bold
          ">すごい！</span>
        </OverlayVisible>
      )}

      {isIncorrectOverlayVisible && (
        <OverlayVisible>
          <span className="
            text-[5rem] lg:text-[10rem]
            text-white font-bold
          ">(;´д｀)</span>
        </OverlayVisible>
      )}

      {isFinishOverlayVisible && (
        <OverlayVisible>
          <div>
            <div
              className="
                text-white
                text-6xl
                font-bold
                mb-4
            ">FINISH</div>
            <div 
              className="
                text-white
                text-4xl
                font-bold
                mb-4
            ">スコア: {result.score}</div>
            <div
              className="
                text-white
                text-4xl
                font-bold
            ">タイムボーナス: {result.time_bonus} </div>
          </div>
        </OverlayVisible>
      )}
    </>
  );
}

export const OverlayVisible = ({
  children,
} : {
  children: React.ReactNode,
}) => {
  return (
    <div 
      className="
      flex flex-col 
      items-center justify-center text-center
      fixed inset-0 bg-black bg-opacity-80 
      z-50
    ">{children}</div>
  );
};
