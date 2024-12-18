"use client"

import React, { 
  useEffect, 
  useState, 
  useRef,
} from 'react';
import { useParams, useRouter } from "next/navigation";

import { useUser } from '@/context/UserContext';
import { Shuting } from '@/types/shuting';
import { Word } from '@/types/shuting';
import { Result } from '@/types/result';
import { fetchData, postData } from '@/lib/api';
import { isErrorResponse } from '@/types/errorResponse';
import { SoundManager } from '../components/soundManager';
import Time from '../components/time';
import ShutingArea from '../components/shutingArea';
import Progress from '../components/progress';
import AnswerArea from '../components/answerArea';
import Overlay from '../components/overlay';
import Countdown from '../components/countdown';

export default function Page() {
  const params = useParams();
  const router = useRouter();

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

  useEffect(() => {
    const fetchShutings = async () => {
      const data: Shuting = await fetchData(getEndpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching lesson data:', data.message);
        return;
      };

      console.log(data.words)

      if (Array.isArray(data.words)) {
        const words: Word[] = data.is_random
          ? [...data.words].sort(() => Math.random() - 0.5)
          : data.words;

        setShutingWords(words);
        setCurrentWord(words[currentIndex]);
        setShutingLimitSec(words[currentIndex]?.limit_sec);
      } else {
        console.error("Expected an array of words, received:", data.words);
      }
    };

    fetchShutings();

    soundManager.playReadyGo();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isStart) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isStart && time !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isStart]);

  const moveToNextExample = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex < shutingWords.length) {
      setCurrentWord(shutingWords[nextIndex]);
      setAnswer('');
      setCurrentIndex(nextIndex);
      setMatchLength(0);
      setShutingLimitSec(shutingWords[nextIndex].limit_sec || null);
    } else {
      handleFinish();
    }
  };

  const handleStart = () => {
    setTime(0);
    setIsStart(true);
    soundManager.playBgm();
  };

  const handleFinish = async () => {
    setIsStart(false);
    setIsFinish(true);
    soundManager.stopBgm();
    soundManager.playFinish();

    const finalResult: Result = {
      ...result,
      time: time,
      perfect_count: perfectCount,
    };

    try {
      const data: Result = await postData(postEndpoint, finalResult);
      if (isErrorResponse(data)) {
        console.error('API Error:', data.message);
      } else if (data && 'id' in data) {
        setResult(prev => ({
          ...prev,
          score: data.score,
          time_bonus: data.time_bonus
        }));
	
          setUserInfo((prev) => ({
            ...prev,
            id: prev?.id ?? null,
            point: data.point ?? 0,
            total_point: prev?.total_point ?? 0,
          }));

        setIsFinishOverlayVisible(true);
        await new Promise(resolve => setTimeout(resolve, 5000));
        setIsFinishOverlayVisible(false);

        router.push(`/result/${data.id}`);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
