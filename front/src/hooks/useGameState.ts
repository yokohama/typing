import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { postData } from '@/lib/api';
import { Word } from '@/types/shuting';
import { Result } from '@/types/result';
import { isErrorResponse } from '@/types/errorResponse';
import { SoundManager } from '@/app/shuting/components/soundManager';
import { UserInfo } from '@/types/userInfo';

export const useGameState = (
  postEndpoint: string,
  shutingWords: Word[],
  currentIndex: number,
  isStart: boolean,
  time: number,
  perfectCount: number,
  result: Result,
  soundManager: SoundManager,
  setTime: React.Dispatch<React.SetStateAction<number>>,
  setIsStart: React.Dispatch<React.SetStateAction<boolean>>,
  setIsFinish: React.Dispatch<React.SetStateAction<boolean>>,
  setCurrentWord: React.Dispatch<React.SetStateAction<Word | null>>,
  setAnswer: React.Dispatch<React.SetStateAction<string>>,
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>,
  setMatchLength: React.Dispatch<React.SetStateAction<number>>,
  setShutingLimitSec: React.Dispatch<React.SetStateAction<number | null>>,
  setResult: React.Dispatch<React.SetStateAction<Result>>,
  setIsFinishOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setUserInfo: (updater: (prev: UserInfo | null) => UserInfo | null) => void
) => {
  const router = useRouter();

  // タイマー用のuseEffect
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
  }, [isStart, time, setTime]);

  // 次の問題へ移動する関数
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

  // ゲーム開始関数
  const handleStart = () => {
    setTime(0);
    setIsStart(true);
    soundManager.playBgm();
  };

  // ゲーム終了関数
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
  };

  return {
    moveToNextExample,
    handleStart,
    handleFinish
  };
};
