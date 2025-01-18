"use client"

import React, { 
  useEffect, 
  useState, 
  useRef,
} from 'react';
import { useParams, useRouter } from "next/navigation";

import { useUser } from '@/context/UserContext';
import { Shuting } from '@/types/shuting';
import { ShutingWord } from '@/types/shuting';
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

  // Shuting全体
  const [isStart, setIsStart] = useState<boolean>(false);
  const [isFinish, setIsFinish] = useState<boolean>(false);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [shutingWords, setShutingWords] = useState<ShutingWord[]>([]);

  // 出題進捗
  const [
    currentShutingWordIndex, 
    setCurrentShutingWordIndex
  ] = useState<number>(0);
  const [
    currentShutingWordLimitSec, 
    setCurrentShutingWordLimitSec
  ] = useState<number | null>(null);
  const [
    currentShutingWord, 
    setCurrentShutingWord
  ] = useState<ShutingWord | null>(null);

  // 解答進捗
  const [
    currentShutingWordAnswer, 
    setCurrentShutingWordAnswer
  ] = useState<string>('');
  const [
    currentShutingWordAnswerMatchedLength, 
    setCurrentShutingWordAnswerMatchedLength
  ] = useState<number>(0);
  const [
    isCurrentShutingWordAnswerComplete, 
    setIsCurrentShutingWordAnswerComplete
  ] = useState(false);
  const [perfectCount, setPerfectCount] = useState<number>(0);

  // 表示アクション
  const [
    isCountdownVisible, 
    setIsCountdownVisible
  ] = useState<boolean>(true);
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

  // 最終結果
  const [result, setResult] = useState<Result>({
    id: undefined,
    user_id: undefined,
    shuting_id: Number(id),
    score: 0,
    correct_count: 0,
    incorrect_count: 0,
    perfect_within_correct_count: 0,
    completion_time: 0,
    gain_coin: 0,
    created_at: undefined
  });

  const soundManager = useRef(new SoundManager()).current;

  // TODO: Stop BGM when use browser back button.
  window.addEventListener('popstate', () => {soundManager.stopBgm() });

  useEffect(() => {
    const fetchShutings = async () => {
      const data: Shuting = await fetchData(getEndpoint, 'GET');

      if (isErrorResponse(data)) {
        console.error('Error fetching lesson data:', data.message);
        return;
      };

      if (Array.isArray(data.words)) {
        const words: ShutingWord[] = data.is_random
          ? [...data.words].sort(() => Math.random() - 0.5)
          : data.words;

        setShutingWords(words);
        setCurrentShutingWord(words[currentShutingWordIndex]);
        setCurrentShutingWordLimitSec(words[currentShutingWordIndex]?.limit_sec);
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
        setCompletionTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isStart && completionTime !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isStart]);

  const moveToNextShutingWord = () => {
    const nextShutingWordIndex = currentShutingWordIndex + 1;

    if (nextShutingWordIndex < shutingWords.length) {
      setCurrentShutingWord(shutingWords[nextShutingWordIndex]);
      setCurrentShutingWordAnswer('');
      setCurrentShutingWordIndex(nextShutingWordIndex);
      setCurrentShutingWordAnswerMatchedLength(0);
      setCurrentShutingWordLimitSec(shutingWords[nextShutingWordIndex].limit_sec || null);
      setIsCurrentShutingWordAnswerComplete(false);
    } else {
      setIsFinish(true);
    }
  };

  const handleStart = () => {
    setCompletionTime(0);
    setIsStart(true);
    soundManager.playBgm();
  };

  useEffect(() => {
    if (!isFinish) { return; }

    const postResult = async () => {
      soundManager.stopBgm();
      soundManager.playFinish();

      const finalResult: Result = {
        ...result,
        completion_time: completionTime,
        perfect_within_correct_count: perfectCount,
      };

      try {
        const data: Result = await postData(postEndpoint, finalResult);

        if (isErrorResponse(data)) {
          console.error('API Error:', data.message);

        } else if (data && 'id' in data) {
          setResult(prev => ({
            ...prev,
            score: data.score,
            gain_coin: data.gain_coin,
          }));

          setUserInfo((prev) => ({
            ...prev,
            id: prev?.id ?? null,
            coin: data.owned_coin ?? 0,
            total_gain_coin: data.total_gain_coin ?? 0,
          }));

          setIsFinishOverlayVisible(true);
          await new Promise(resolve => setTimeout(resolve, 5000));
          setIsFinishOverlayVisible(false);

          router.push(`/result/${data.id}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    setIsStart(false);
    soundManager.stopBgm();
    soundManager.playFinish();

    postResult();
  }, [isFinish]);

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
        <Time time={completionTime} />

        <Progress
          currentShutingWordIndex={currentShutingWordIndex}
          shutingWordsLength={shutingWords.length}
          isFinish={isFinish}
        />

        <ShutingArea
          currentWordLimitSec={currentShutingWordLimitSec}
          setCurrentWordLimitSec={setCurrentShutingWordLimitSec}
          currentShutingWord={currentShutingWord}
          currentShutingWordAnswer={currentShutingWordAnswer}
          currentShutingWordAnswerMatchedLength={currentShutingWordAnswerMatchedLength}
          setCurrentShutingWordAnswerMatchedLength={setCurrentShutingWordAnswerMatchedLength}
          soundManager={soundManager}
          moveToNextShutingWord={moveToNextShutingWord}
          isStart={isStart}
          setResult={setResult}
          setIsIncorrectOverlayVisible={setIsIncorrectOverlayVisible}
          currentShutingWordIndex={currentShutingWordIndex}
        />

        <AnswerArea
          currentShutingWordAnswer={currentShutingWordAnswer}
          currentShutingWord={currentShutingWord}
          isCurrentShutingWordAnswerComplete={isCurrentShutingWordAnswerComplete}
          setIsCurrentShutingWordAnswerComplete={setIsCurrentShutingWordAnswerComplete}
          soundManager={soundManager}
          setIsCorrectOverlayVisible={setIsCorrectOverlayVisible}
          setIsPerfectOverlayVisible={setIsPerfectOverlayVisible}
          moveToNextShutingWord={moveToNextShutingWord}
          setResult={setResult}
          setAnswer={setCurrentShutingWordAnswer}
          setPerfectCount={setPerfectCount}
        />
      </main>
    </div>
  );
}
