"use client"

import React, { 
  useState, 
  useRef,
} from 'react';
import { useParams } from "next/navigation";

import { useUser } from '@/context/UserContext';
import { Word } from '@/types/shuting';
import { Result } from '@/types/result';
import { SoundManager } from '../components/soundManager';
import Time from '../components/time';
import ShutingArea from '../components/shutingArea';
import Progress from '../components/progress';
import AnswerArea from '../components/answerArea';
import Overlay from '../components/overlay';
import Countdown from '../components/countdown';
import { useShutingData } from '@/hooks/useShutingData';
import { useGameState } from '@/hooks/useGameState';

export default function Page() {
  const params = useParams();

  const id = params?.id;

  const getEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/shutings/${id}`;
  const postEndpoint = `${process.env.NEXT_PUBLIC_API_ENDPOINT_URL}/user/shutings/${id}/results`;

  const { setUserInfo } = useUser();
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [isCountdownVisible, setIsCountdownVisible] = useState<boolean>(true);
  const [shutingWords, setShutingWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [answer, setAnswer] = useState<string>('');
  const [perfectCount, setPerfectCount] = useState<number>(0);

  const [
    isCorrectOverlayVisible, 
    setIsCorrectOverlayVisible
  ] = useState(false);
  const [
    isPerfectOverlayVisible, 
    setIsPerfectOverlayVisible
  ] = useState(false);
  const [
    isIncorrectOverlayVisible, 
    setIsIncorrectOverlayVisible
  ] = useState(false);
  const [
    isFinishOverlayVisible, 
    setIsFinishOverlayVisible
  ] = useState(false);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [shutingLimitSec, setShutingLimitSec] = useState<number | null>(null);
  const [matchLength, setMatchLength] = useState<number>(0);
  const [result, setResult] = useState<Result>({
    id: undefined,
    user_id: undefined,
    shuting_id: Number(id),
    score: 0,
    correct_count: 0,
    incorrect_count: 0,
    time: 0,
    perfect_count: 0,
    time_bonus: 0,
    point: 0,
    created_at: undefined
  });

  const soundManager = useRef(new SoundManager()).current;

  // Stop BGM when use browser back button.
  window.addEventListener('popstate', () => {soundManager.stopBgm() });

  // データ取得ロジックをカスタムフックに分離
  useShutingData(
    getEndpoint,
    currentIndex,
    setShutingWords,
    setCurrentWord,
    setShutingLimitSec,
    soundManager
  );

  // ゲーム状態管理ロジックをカスタムフックに分離
  const { moveToNextExample, handleStart } = useGameState(
    postEndpoint,
    shutingWords,
    currentIndex,
    isStart,
    time,
    perfectCount,
    result,
    soundManager,
    setTime,
    setIsStart,
    setIsFinish,
    setCurrentWord,
    setAnswer,
    setCurrentIndex,
    setMatchLength,
    setShutingLimitSec,
    setResult,
    setIsFinishOverlayVisible,
    setUserInfo
  );

  return(
    <div className="flex justify-center min-h-screen bg-gray-50 relative">
      <Countdown
        isCountdownVisible={isCountdownVisible}
        setIsCountdownVisible={setIsCountdownVisible}
	handleStart={handleStart}
      />

      <Overlay 
        isCorrectOverlayVisible={isCorrectOverlayVisible}
        isPerfectOverlayVisible={isPerfectOverlayVisible}
        isIncorrectOverlayVisible={isIncorrectOverlayVisible}
        isFinishOverlayVisible={isFinishOverlayVisible}
        result={result}
      />

      <main className="w-full max-w-5xl bg-white p-6">
        <Time time={time} />

        <Progress
          currentIndex={currentIndex}
          shutingWordsLength={shutingWords.length}
          isFinish={isFinish}
        />

        <ShutingArea
          shutingLimitSec={shutingLimitSec}
          word={currentWord}
          answer={answer}
          matchLength={matchLength}
          setMatchLength={setMatchLength}
          soundManager={soundManager}
          moveToNextExample={moveToNextExample}
          isStart={isStart}
          setShutingLimitSec={setShutingLimitSec}
          setResult={setResult}
          setIsIncorrectOverlayVisible={setIsIncorrectOverlayVisible}
          currentIndex={currentIndex}
        />

        <AnswerArea
          answer={answer}
          word={currentWord}
          soundManager={soundManager}
          setIsCorrectOverlayVisible={setIsCorrectOverlayVisible}
          setIsPerfectOverlayVisible={setIsPerfectOverlayVisible}
          moveToNextExample={moveToNextExample}
          setResult={setResult}
          setAnswer={setAnswer}
          setPerfectCount={setPerfectCount}
        />
      </main>
    </div>
  );
}
