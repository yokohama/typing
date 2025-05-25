import React, { useState } from 'react';
import { Player } from '../data/mockPlayers';

type PlayerCardProps = {
  player: Player;
  rank: number;
};

// Gravatar風のイニシャルアバター生成関数
const InitialAvatar = ({ name, size = 40 }: { name: string; size?: number }) => {
  // 名前の最初の文字を取得（日本語対応）
  const initial = name.charAt(0).toUpperCase();

  // 名前をベースにした色を生成
  const getColorFromName = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
      '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
      '#F39C12', '#E74C3C', '#9B59B6', '#3498DB', '#1ABC9C',
      '#2ECC71', '#F1C40F', '#E67E22', '#E91E63', '#9C27B0'
    ];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className="flex items-center justify-center w-full h-full rounded-full text-white font-bold shadow-sm"
      style={{
        backgroundColor: getColorFromName(name),
        fontSize: `${size * 0.4}px`
      }}
    >
      {initial}
    </div>
  );
};

// アバターが有効かどうかを判定する関数
const isValidAvatarUrl = (url: string | null | undefined): boolean => {
  return !!(url && url.trim() !== '' && url !== 'null' && url !== 'undefined');
};

const PlayerCard = ({ player, rank }: PlayerCardProps) => {
  const [imageError, setImageError] = useState(false);

  // アバターURLが有効で、かつ画像読み込みエラーが発生していない場合のみ画像を表示
  const shouldShowImage = isValidAvatarUrl(player.avatarUrl) && !imageError;

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3">
      {/* ランク表示 */}
      <div className="flex-shrink-0 mr-3 w-8 h-8 flex items-center justify-center rounded-full font-bold text-white"
        style={{
          backgroundColor:
            rank === 1 ? '#FFD700' : // 金
            rank === 2 ? '#C0C0C0' : // 銀
            rank === 3 ? '#CD7F32' : // 銅
            '#6366F1' // その他
        }}
      >
        {rank}
      </div>

      {/* アバター表示 - 動的判定 */}
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full overflow-hidden relative">
          {shouldShowImage ? (
            <img 
              src={player.avatarUrl!}
              alt={`${player.name}のアバター`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <InitialAvatar name={player.name} size={40} />
          )}
        </div>
      </div>

      {/* プレイヤー名 */}
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">{player.name}</h3>
      </div>

      {/* スコア表示 */}
      <div className="flex-shrink-0 text-right">
        <div className="font-bold text-indigo-600">{player.totalScore.toLocaleString()}</div>
        <div className="text-xs text-gray-500">スコア</div>
      </div>
    </div>
  );
};

export default PlayerCard;
