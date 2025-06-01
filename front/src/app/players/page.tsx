"use client";

import React, { useEffect } from 'react';
import PlayerCard from '../../components/PlayerCard';
import { mockPlayers } from '../../data/mockPlayers';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

export default function PlayersPage() {
  // スコア順にプレーヤーをソート
  const sortedPlayers = [...mockPlayers].sort((a, b) => b.totalScore - a.totalScore);

  // インフィニティスクロールフックを使用
  const { visibleItems, hasMore, loading, lastElementRef } = useInfiniteScroll(sortedPlayers);

  // ヘッダーリンクの問題を修正するuseEffect
  useEffect(() => {
    const fixHeaderLink = () => {
      // ヘッダーのリンク要素を取得
      const headerLink = document.querySelector('header a');
      if (headerLink) {
        // 既存のクリックイベントリスナーをクリア
        const newHeaderLink = headerLink.cloneNode(true) as HTMLElement;
        headerLink.parentNode?.replaceChild(newHeaderLink, headerLink);

        // 新しいクリックイベントリスナーを追加
        newHeaderLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // /shutingページに強制遷移
          window.location.href = '/shuting';
        });

        console.log('Header link fixed for players page');
      }
    };

    // ページロード後に実行
    fixHeaderLink();

    // 少し遅延してもう一度実行（DOMの更新を待つため）
    const timer = setTimeout(fixHeaderLink, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">プレーヤーランキング</h1>
        <p className="text-gray-600">タイピングゲームのトップスコアプレーヤーです</p>
      </div>

      <div className="bg-indigo-50 p-6 rounded-lg mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-indigo-800">トータルスコアランキング</h2>
        </div>
        <p className="text-indigo-700">プレーヤーのスコアランキングを表示しています。下にスクロールすると、さらに表示されます。</p>
      </div>

      <div className="space-y-3">
        {visibleItems.map((player, index) => (
          <div
            key={player.id}
            ref={index === visibleItems.length - 1 ? lastElementRef : null}
          >
            <PlayerCard 
              player={player}
              rank={index + 1}
            />
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center p-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      )}

      {!hasMore && visibleItems.length > 0 && (
        <p className="text-center p-4 text-gray-500">
          すべてのプレーヤーを表示しました
        </p>
      )}
    </div>
  );
}
