import React, { ChangeEvent, useState } from "react";

import { ShutingData } from "@/types/shuting";
import { SoundManager } from "./soundManager";
import { ResultData } from "@/types/result";

type AnswerAreaProps =  {
  answerData: string;
  shutingData: ShutingData | null;
  soundManager: SoundManager;
  setIsCorrectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setResultData: React.Dispatch<React.SetStateAction<ResultData>>;
  moveToNextExample: () => void;
  setAnswerData: React.Dispatch<React.SetStateAction<string>>,
  setPerfectCount: React.Dispatch<React.SetStateAction<number>>,
};

export default function AnswerArea({ 
  answerData, 
  shutingData,
  soundManager,
  setIsCorrectOverlayVisible,
  setResultData,
  moveToNextExample,
  setAnswerData,
  setPerfectCount,
}: AnswerAreaProps) {

  const [isUseDelete, setIsUseDelete] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAnswerData(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (shutingData && answerData === shutingData.word) {
        setIsCorrectOverlayVisible(true);
        soundManager.playCorrect();
        setTimeout(() => {
          setIsCorrectOverlayVisible(false);
          moveToNextExample();
        }, 1000);

        setResultData(prev => ({
          ...prev,
          correct_count: (prev.correct_count ?? 0) + 1,
        }));

        if (!isUseDelete) {
          setPerfectCount((prev) => prev + 1);
        }
      }
    }

    if (e.key === 'Backspace' && !e.shiftKey) {
      setIsUseDelete(true);
    }
  };

  return(
    <div id="answerArea" className="w-full">
      <input
        type="text"
        value={answerData}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
