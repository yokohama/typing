import React, { ChangeEvent, useState, useEffect } from "react";

import { SoundManager } from "./soundManager";
import { Result } from "@/types/result";
import { Word } from "@/types/shuting";

type AnswerAreaProps = {
  answer: string;
  word: Word | null;
  soundManager: SoundManager;
  setIsCorrectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPerfectOverlayVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setResult: React.Dispatch<React.SetStateAction<Result>>;
  moveToNextExample: () => void;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  setPerfectCount: React.Dispatch<React.SetStateAction<number>>;
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
  const [position, setPosition] = useState(0);
  const [romaji, setRomaji] = useState<string>("");

  // かな→ローマ字変換マップ
  const kanaToRomaji: { [key: string]: string } = {
    'あ': 'a', 'い': 'i', 'う': 'u', 'え': 'e', 'お': 'o',
    'か': 'ka', 'き': 'ki', 'く': 'ku', 'け': 'ke', 'こ': 'ko',
    'さ': 'sa', 'し': 'shi', 'す': 'su', 'せ': 'se', 'そ': 'so',
    'た': 'ta', 'ち': 'chi', 'つ': 'tsu', 'て': 'te', 'と': 'to',
    'な': 'na', 'に': 'ni', 'ぬ': 'nu', 'ね': 'ne', 'の': 'no',
    'は': 'ha', 'ひ': 'hi', 'ふ': 'fu', 'へ': 'he', 'ほ': 'ho',
    'ま': 'ma', 'み': 'mi', 'む': 'mu', 'め': 'me', 'も': 'mo',
    'や': 'ya', 'ゆ': 'yu', 'よ': 'yo',
    'ら': 'ra', 'り': 'ri', 'る': 'ru', 'れ': 're', 'ろ': 'ro',
    'わ': 'wa', 'を': 'wo', 'ん': 'n',
    'が': 'ga', 'ぎ': 'gi', 'ぐ': 'gu', 'げ': 'ge', 'ご': 'go',
    'ざ': 'za', 'じ': 'ji', 'ず': 'zu', 'ぜ': 'ze', 'ぞ': 'zo',
    'だ': 'da', 'ぢ': 'ji', 'づ': 'zu', 'で': 'de', 'ど': 'do',
    'ば': 'ba', 'び': 'bi', 'ぶ': 'bu', 'べ': 'be', 'ぼ': 'bo',
    'ぱ': 'pa', 'ぴ': 'pi', 'ぷ': 'pu', 'ぺ': 'pe', 'ぽ': 'po',
  };

  // ひらがなからローマ字への変換とマッピング生成
  const createRomajiMapping = (text: string): { romaji: string; mapping: number[] } => {
    let romaji = "";
    let mapping: number[] = [];

    if (!text) return { romaji, mapping };

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const romajiChar = kanaToRomaji[char] || char;

      romaji += romajiChar;

      // 各ローマ字の位置がどのひらがなに対応するかをマッピング
      for (let j = 0; j < romajiChar.length; j++) {
        mapping.push(i);
      }
    }

    return { romaji, mapping };
  };

  // 単語が変わった時にローマ字変換とマッピングを更新
  useEffect(() => {
    if (word && word.word) {
      const { romaji: newRomaji } = createRomajiMapping(word.word);
      setRomaji(newRomaji);
    } else {
      setRomaji("");
    }

    setPosition(0);
    setAnswer("");
  }, [word, setAnswer]);

  // 入力は無視して、キーイベントだけ処理
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 特殊キーは無視
    if (["Shift", "Control", "Alt", "Meta", "CapsLock"].includes(e.key)) {
      return;
    }

    // バックスペースの処理
    if (e.key === "Backspace") {
      setIsTypeDeleteKey(true);
      if (position > 0) {
        setPosition(position - 1);

        // 単語が存在する場合のみマッピングを使用
        if (word && word.word) {
          const { mapping } = createRomajiMapping(word.word);
          const hiraganaIndex = mapping[position - 1];

          // 新しいひらがな表示文字列を計算
          const newHiraganaLength = hiraganaIndex;
          const wordText = word.word || "";
          setAnswer(wordText.substring(0, newHiraganaLength));
        }
      }
      return;
    }

    // Enterキーの処理
    if (e.key === "Enter") {
      e.preventDefault();
      if (word && word.word && answer === word.word) {
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
      return;
    }

    // ローマ字入力の判定
    const expectedKey = romaji[position];

    if (expectedKey && e.key === expectedKey) {
      // 正解
      soundManager.playCorrect();

      // 位置を進める
      const newPosition = position + 1;
      setPosition(newPosition);

      // 単語が存在する場合のみマッピングを使用
      if (word && word.word) {
        const { mapping } = createRomajiMapping(word.word);

        // 現在の入力に対応するひらがなのインデックスを取得
        const hiraganaIndex = mapping[newPosition - 1] + 1;

        // ひらがな表示を更新
        const wordText = word.word || "";
        setAnswer(wordText.substring(0, hiraganaIndex));
      }

      // 全て入力完了したら次へ
      if (newPosition >= romaji.length) {
        setTimeout(() => {
          setResult((prev) => ({
            ...prev,
            correct_count: prev.correct_count + 1,
          }));
          soundManager.playPerfect();
          setPerfectCount((prev) => prev + 1);
          setIsPerfectOverlayVisible(true);
          setTimeout(() => {
            setIsPerfectOverlayVisible(false);
            moveToNextExample();
          }, 1000);
        }, 200);
      }
    } else {
      // 不正解
      soundManager.playIncorrect();
    }

    // デフォルトの入力動作を抑制
    e.preventDefault();
  };

  return (
    <div id="answerArea" className="w-full">
      <div className="text-sm mb-2">
        次のキー: <strong>{romaji[position] || ""}</strong>
      </div>

      <input
        type="text"
        value={answer}
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
        "
      />
    </div>
  );
}
