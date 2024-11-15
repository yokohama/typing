import React, { useEffect } from "react";

import { ResultData } from "@/types/result";
import { SoundManager } from "./soundManager";

type ShutingAreaProps = {
  shutingLimitSec: number | null;
  shutingData: { 
    limit_sec?: number;
    word?: string;
  } | null;
  answerData: string;
  matchLength: number;
  setMatchLength: React.Dispatch<React.SetStateAction<number>>;
  soundManager: SoundManager;
  moveToNextExample: () => void;
  isStart: boolean;
  setShutingLimitSec: React.Dispatch<React.SetStateAction<number | null>>;
  setResultData: React.Dispatch<React.SetStateAction<ResultData>>;
  setIsIncorrectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ShutingArea({
  shutingLimitSec,
  shutingData,
  answerData,
  matchLength,
  setMatchLength,
  soundManager,
  moveToNextExample,
  isStart,
  setShutingLimitSec,
  setResultData,
  setIsIncorrectOverlayVisible,
}: ShutingAreaProps) {

  useEffect(() => {
    if (!isStart || shutingLimitSec === null || shutingLimitSec <= 0) return;

    const shutingInterval = setInterval(() => {
      setShutingLimitSec(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(shutingInterval);
          handleTimeLimitExceeded();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(shutingInterval);
  }, [shutingLimitSec, isStart]);

  const handleTimeLimitExceeded = () => {
    setResultData(prev => ({
      ...prev,
      incorrect_count: (prev.incorrect_count ?? 0) + 1,
    }));
    soundManager.playIncorrect();
    setIsIncorrectOverlayVisible(true);
    setTimeout(() => {
      setIsIncorrectOverlayVisible(false);
      moveToNextExample();
    }, 1000);
  };

  const getHighlightParts = () => {
    if (!shutingData?.word) return { matchingText: "", remainingText: "" };

    let newMatchLength = 0;
    for (let i = 0; i < answerData.length; i++) {
      if (answerData[i] === shutingData.word[i]) {
        newMatchLength++;
      } else {
        break;
      }
    }

    if (newMatchLength > matchLength) {
      soundManager.playSuccess();
      setMatchLength(newMatchLength);
    }

    return {
      matchingText: shutingData.word.slice(0, newMatchLength),
      remainingText: shutingData.word.slice(newMatchLength),
    };
  };

  const { matchingText, remainingText } = getHighlightParts();

  const borderColor = shutingLimitSec !== null && shutingData?.limit_sec
    ? `rgba(
        ${Math.round(220 * (1 - shutingLimitSec / (shutingData.limit_sec || 1))) + 35}, 
        ${Math.round(180 * (shutingLimitSec / (shutingData.limit_sec || 1)))}, 
        ${Math.round(50 * (shutingLimitSec / (shutingData.limit_sec || 1)))}, 1)`
    : "rgba(220, 50, 50, 1)";

  const backgroundColor = shutingLimitSec !== null && shutingData?.limit_sec
    ? `rgba(
        ${Math.round(220 * (1 - shutingLimitSec / (shutingData.limit_sec || 1))) + 35}, 
        ${Math.round(180 * (shutingLimitSec / (shutingData.limit_sec || 1)))}, 
        ${Math.round(50 * (shutingLimitSec / (shutingData.limit_sec || 1)))}, 0.1)`
    : "rgba(220, 50, 50, 0.1)";

  return(
    <div
      id="shutingArea"
      className="mb-6 p-8 text-center text-2xl font-bold text-gray-800 rounded-lg shadow-lg w-full"
      style={{
        border: "4px solid",
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }}
    >
      <span>
        <span className="text-green-600 font-bold">{matchingText}</span>
        <span>{remainingText}</span>
      </span>
    </div>
  );
}
