"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// コンテキストで値の型定義
type BackButtonContextType = {
  isBackButtonPressed: boolean;
  setBackButtonHandler: (handler: (() => void) | null) => void;
};

// コンテキストの作成
const BackButtonContext = createContext<BackButtonContextType | undefined>(undefined);

/**
 * 戻るボタン制御のためのプロバイダーコンポーネント
 * このコンポーネントでアプリをラップすることで、アプリ内のどこからでも戻るボタンの状態にアクセスできる
 */
export const BackButtonProvider = ({ children }: { children: ReactNode }) => {
  // 戻るボタンが押されたかどうかの状態
  const [isBackButtonPressed, setIsBackButtonPressed] = useState(false);
  // 戻るボタンが押された時に実行するカスタムハンドラー
  const [customHandler, setCustomHandler] = useState<(() => void) | null>(null);

  useEffect(() => {
    /**
     * popstateイベントのハンドラー関数
     * ブラウザの戻るボタンが押された時に呼び出される
     */
    const handlePopState = (event: PopStateEvent) => {
      // 戻るボタンが押されたことを記録
      setIsBackButtonPressed(true);

      // デバッグ用ログ出力（console.logで出力）
      console.log('ブラウザの戻るボタンが押されました', event);

      // カスタムハンドラーが設定されていれば実行
      if (customHandler) {
        customHandler();
      }

      // 少し時間を置いてフラグをリセット（連続クリック対策）
      setTimeout(() => {
        setIsBackButtonPressed(false);
      }, 100);

      // 現在のURLを再度pushStateすることで、実際の履歴移動を防ぐ
      window.history.pushState(null, '', window.location.pathname);
    };

    // 履歴エントリーを現在のページに追加（これにより「戻る」操作を検知できる）
    window.history.pushState(null, '', window.location.pathname);

    // ブラウザの「戻る」ボタンイベント（popstate）のリスナー登録
    window.addEventListener('popstate', handlePopState);

    // コンポーネントのクリーンアップ時にイベントリスナーを削除
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [customHandler]); // customHandlerが変更された時に再実行

  /**
   * 戻るボタンが押された時に実行するカスタムハンドラーを設定する関数
   * @param handler 実行する関数、またはnull（ハンドラーを削除する場合）
   */
  const setBackButtonHandler = (handler: (() => void) | null) => {
    setCustomHandler(handler);
  };

  // コンテキストプロバイダーで子コンポーネントをラップ
  return (
    <BackButtonContext.Provider value={{ isBackButtonPressed, setBackButtonHandler }}>
      {children}
    </BackButtonContext.Provider>
  );
};

/**
 * 戻るボタンの状態とハンドラーにアクセスするためのカスタムフック
 * コンポーネント内で戻るボタンの状態を取得したり、ハンドラーを設定したりするために使用
 */
export const useBackButton = () => {
  const context = useContext(BackButtonContext);

  // BackButtonProviderの外部で使用された場合はエラー
  if (context === undefined) {
    throw new Error('useBackButton must be used within a BackButtonProvider');
  }

  return context;
};
