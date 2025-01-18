import React, { ChangeEvent, useState, useEffect } from "react";

import { SoundManager } from "./soundManager";
import { Result } from "@/types/result";
import { ShutingWord } from "@/types/shuting";

type AnswerAreaProps =  {
  currentShutingWordAnswer: string;
  currentShutingWord: ShutingWord | null;
  isCurrentShutingWordAnswerComplete: boolean;
  setIsCurrentShutingWordAnswerComplete: React.Dispatch<React.SetStateAction<boolean>>,
  soundManager: SoundManager;
  setIsCorrectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPerfectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<Result>>;
  moveToNextShutingWord: () => void;
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  setPerfectCount: React.Dispatch<React.SetStateAction<number>>,
};

export default function AnswerArea({ 
  currentShutingWordAnswer, 
  currentShutingWord,
  isCurrentShutingWordAnswerComplete,
  setIsCurrentShutingWordAnswerComplete,
  soundManager,
  setIsCorrectOverlayVisible,
  setIsPerfectOverlayVisible,
  setResult,
  moveToNextShutingWord,
  setAnswer,
  setPerfectCount,
}: AnswerAreaProps) {

  const [isTypeDeleteKey, setIsTypeDeleteKey] = useState(false);

  useEffect(() => {
    if (!isCurrentShutingWordAnswerComplete) {
      return;
    }

    setResult((prev) => ({
      ...prev,
      correct_count: prev.correct_count + 1,
    }));
    
    if (!isTypeDeleteKey) {
      soundManager.playPerfect();
      setPerfectCount((prev) => prev + 1);
      setIsPerfectOverlayVisible(true);
      setTimeout(() => {
        setIsPerfectOverlayVisible(false);
        moveToNextShutingWord();
      }, 1000);
    } else {
      soundManager.playCorrect();
      setIsTypeDeleteKey(false);
      setIsCorrectOverlayVisible(true);
      setTimeout(() => {
        setIsCorrectOverlayVisible(false);
        moveToNextShutingWord();
      }, 1000);
    }

  }, [isCurrentShutingWordAnswerComplete]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setAnswer(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCurrentShutingWordAnswerComplete) {
      return;
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();

      if (currentShutingWord 
        && currentShutingWordAnswer === currentShutingWord.word) {
        setIsCurrentShutingWordAnswerComplete(true);
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
        value={currentShutingWordAnswer}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        autoFocus
        className="
          w-full p-4
          text-2xl lg:text-4xl
          text-center
          font-bold
          border-2 border-gray-300
          rounded-lg
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
      "/>
    </div>
  );
}
