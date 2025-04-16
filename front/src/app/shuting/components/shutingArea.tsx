import React, { useEffect, useMemo } from "react";
import { Result } from "@/types/result";
import { ShutingWord } from "@/types/shuting";
import { SoundManager } from "./soundManager";

type ShutingAreaProps = {
  currentWordLimitSec: number | null;
  currentShutingWord: ShutingWord | null;
  currentShutingWordAnswer: string;
  currentShutingWordAnswerMatchedLength: number;
  setCurrentShutingWordAnswerMatchedLength: React.Dispatch<React.SetStateAction<number>>;
  soundManager: SoundManager;
  moveToNextShutingWord: () => void;
  isStart: boolean;
  setCurrentWordLimitSec: React.Dispatch<React.SetStateAction<number | null>>;
  setResult: React.Dispatch<React.SetStateAction<Result>>;
  setIsIncorrectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  currentShutingWordIndex: number;
};

export default function ShutingArea({
  currentWordLimitSec,
  currentShutingWord,
  currentShutingWordAnswer,
  currentShutingWordAnswerMatchedLength,
  setCurrentShutingWordAnswerMatchedLength,
  soundManager,
  moveToNextShutingWord,
  isStart,
  setCurrentWordLimitSec,
  setResult,
  setIsIncorrectOverlayVisible,
  currentShutingWordIndex,
}: ShutingAreaProps) {

  const newMatchLength = useMemo(() => {
    if (!currentShutingWord?.word) return 0;

    let progressMatchLength = 0;
    for (let i = 0; i < currentShutingWordAnswer.length; i++) {
      if (currentShutingWordAnswer[i] === currentShutingWord?.word[i]) {
        progressMatchLength++;
      } else {
        break;
      }
    }
    return progressMatchLength;
  }, [currentShutingWordAnswer, currentShutingWord?.word]);

  useEffect(() => {
    if (newMatchLength > currentShutingWordAnswerMatchedLength) {
      soundManager.playSuccess();
      setCurrentShutingWordAnswerMatchedLength(newMatchLength);
    }
  }, [newMatchLength, currentShutingWordAnswerMatchedLength, soundManager]);

  useEffect(() => {
    if (!isStart || currentWordLimitSec === null || currentWordLimitSec <= 0) return;

    const interval = setInterval(() => {
      setCurrentWordLimitSec(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isStart, currentShutingWordIndex]);

  useEffect(() => {
    if (currentWordLimitSec === 0) {
      handleTimeLimitExceeded();
    }
  }, [currentWordLimitSec]);

  const handleTimeLimitExceeded = () => {
    setResult(prevResult => ({
      ...prevResult,
      incorrect_count: prevResult.incorrect_count + 1,
    }));
    soundManager.playIncorrect();
    setIsIncorrectOverlayVisible(true);
    setTimeout(() => {
      setIsIncorrectOverlayVisible(false);
      moveToNextShutingWord();
    }, 1000);
  };

  const borderColor = currentWordLimitSec !== null && currentShutingWord?.limit_sec
    ? `rgba(
        ${Math.round(220 * (1 - currentWordLimitSec / (currentShutingWord.limit_sec || 1))) + 35}, 
        ${Math.round(180 * (currentWordLimitSec / (currentShutingWord.limit_sec || 1)))}, 
        ${Math.round(50 * (currentWordLimitSec / (currentShutingWord.limit_sec || 1)))}, 1)`
    : "rgba(220, 50, 50, 1)";

  const backgroundColor = currentWordLimitSec !== null && currentShutingWord?.limit_sec
    ? `rgba(
        ${Math.round(220 * (1 - currentWordLimitSec / (currentShutingWord.limit_sec || 1))) + 35}, 
        ${Math.round(180 * (currentWordLimitSec / (currentShutingWord.limit_sec || 1)))}, 
        ${Math.round(50 * (currentWordLimitSec / (currentShutingWord.limit_sec || 1)))}, 0.1)`
    : "rgba(220, 50, 50, 0.1)";

  return (
    <div
      id="shutingArea"
      style={{
        border: "4px solid",
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }}
      className="
        w-full
        mb-6 p-8
        text-center
        text-3xl lg:text-5xl
        font-bold text-gray-800
        rounded-lg shadow-lg
    ">
      <span>
        <span className="text-green-600 font-bold">
          {currentShutingWord?.word?.slice(0, newMatchLength)}
        </span>
        <span>
          {currentShutingWord?.word?.slice(newMatchLength)}
        </span>
      </span>
    </div>
  );
}
