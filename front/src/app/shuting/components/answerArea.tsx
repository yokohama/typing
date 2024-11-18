import React, { ChangeEvent, useState } from "react";

import { SoundManager } from "./soundManager";
import { Result } from "@/types/result";
import { Word } from "@/types/shuting";

type AnswerAreaProps =  {
  answer: string;
  word: Word | null;
  soundManager: SoundManager;
  setIsCorrectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPerfectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<Result>>;
  moveToNextExample: () => void;
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  setPerfectCount: React.Dispatch<React.SetStateAction<number>>,
};

export default function AnswerArea({ 
  answer, 
  word,
  soundManager,
  setIsCorrectOverlayVisible,
  setIsPerfectOverlayVisible,
  setResult,
  moveToNextExample,
  setAnswer,
  setPerfectCount,
}: AnswerAreaProps) {

  const [isTypeDeleteKey, setIsTypeDeleteKey] = useState(false);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAnswer(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      setResult((prev) => ({
        ...prev,
        correct_count: prev.correct_count + 1,
      }));

      if (word && answer === word.word) {
        if (!isTypeDeleteKey) {
          soundManager.playPerfect();
          setPerfectCount((prev) => prev + 1);
          setIsPerfectOverlayVisible(true);
          setTimeout(() => {
            setIsPerfectOverlayVisible(false);
            moveToNextExample();
          }, 1000);
        } else {
          soundManager.playCorrect();
          setIsTypeDeleteKey(false);
          setIsCorrectOverlayVisible(true);
          setTimeout(() => {
            setIsCorrectOverlayVisible(false);
            moveToNextExample();
          }, 1000);
        }
      }
    }

    if (e.key === 'Backspace' && !e.shiftKey) {
      setIsTypeDeleteKey(true);
    }
  };

  return(
    <div id="answerArea" className="w-full">
      <input
        type="text"
        value={answer}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        autoFocus
        className="
          w-full p-4
          text-xl border-2 border-gray-300
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
      "/>
    </div>
  );
}
