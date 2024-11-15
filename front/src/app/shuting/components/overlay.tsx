type OverlayProps = {
  isCorrectOverlayVisible: boolean,
  isIncorrectOverlayVisible: boolean,
  isFinishOverlayVisible: boolean,
};

export default function Overlay({
  isCorrectOverlayVisible,
  isIncorrectOverlayVisible,
  isFinishOverlayVisible,
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
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
         >
          <span className="text-red text-[10rem] font-bold">Finish</span>
        </div>
      )}
    </>
  );
}
