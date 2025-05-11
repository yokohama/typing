import React from 'react';
import Image from 'next/image';
import { Player } from '@/data/mockPlayers';

type PlayerCardProps = {
  player: Player;
  rank: number;
};

const PlayerCard = ({ player, rank }: PlayerCardProps) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-3">
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
      
      <div className="flex-shrink-0 mr-4">
        <div className="w-10 h-10 rounded-full overflow-hidden relative">
          <Image 
            src={player.avatarUrl} 
            alt={`${player.name}のアバター`}
            width={40}
            height={40}
          />
        </div>
      </div>
      
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">{player.name}</h3>
      </div>
      
      <div className="flex-shrink-0 text-right">
        <div className="font-bold text-indigo-600">{player.totalScore.toLocaleString()}</div>
        <div className="text-xs text-gray-500">スコア</div>
      </div>
    </div>
  );
};

export default PlayerCard;
