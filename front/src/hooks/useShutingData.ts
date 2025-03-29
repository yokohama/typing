import { useEffect } from 'react';
import { fetchData } from '@/lib/api';
import { Shuting, Word } from '@/types/shuting';
import { isErrorResponse } from '@/types/errorResponse';
import { SoundManager } from '@/app/shuting/components/soundManager';

export const useShutingData = (
  getEndpoint: string,
  currentIndex: number,
  setShutingWords: React.Dispatch<React.SetStateAction<Word[]>>,
  setCurrentWord: React.Dispatch<React.SetStateAction<Word | null>>,
  setShutingLimitSec: React.Dispatch<React.SetStateAction<number | null>>,
  soundManager: SoundManager
) => {
  // データ取得用のuseEffect
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
  // マウント時に一度だけデータを取得したいため、依存配列は空にしています
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
