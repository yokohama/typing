import React, { ChangeEvent, useState } from "react";

import { Shuting } from "@/types/shuting";
import { SoundManager } from "./soundManager";
import { ResultData } from "@/types/result";

type AnswerAreaProps =  {
  answer: string;
  shuting: Shuting | null;
  soundManager: SoundManager;
  setIsCorrectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<ResultData>>;
  moveToNextExample: () => void;
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  setPerfectCount: React.Dispatch<React.SetStateAction<number>>,
};

export default function AnswerArea({ 
  answer, 
  shuting,
  soundManager,
  setIsCorrectOverlayVisible,
  setResult,
  moveToNextExample,
  setAnswer,
  setPerfectCount,
}: AnswerAreaProps) {

  const [isUseDelete, setIsUseDelete] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAnswer(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (shuting && answer === shuting.word) {
        setIsCorrectOverlayVisible(true);
        soundManager.playCorrect();
        setTimeout(() => {
          setIsCorrectOverlayVisible(false);
          moveToNextExample();
        }, 1000);

        setResult(prevResult => ({
          ...prevResult,
          correct_count: prevResult.correct_count + 1,
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
        value={answer}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="w-full p-4 text-xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
