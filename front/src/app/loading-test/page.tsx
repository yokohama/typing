"use client";

import React, { useState } from 'react';
import Loading from '@/components/Loading';

export default function LoadingTest() {
  // sizeの型を明示的に指定
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [color, setColor] = useState('#6366F1');

  const colors = [
    { name: 'インディゴ', value: '#6366F1' },
    { name: '赤', value: '#EF4444' },
    { name: '緑', value: '#10B981' },
    { name: '青', value: '#3B82F6' },
    { name: '黄', value: '#F59E0B' },
    { name: 'ピンク', value: '#EC4899' }
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">ローディングテスト</h1>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">サイズ:</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSize('small')}
            className={`px-4 py-2 rounded ${size === 'small' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Small
          </button>
          <button
            onClick={() => setSize('medium')}
            className={`px-4 py-2 rounded ${size === 'medium' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Medium
          </button>
          <button
            onClick={() => setSize('large')}
            className={`px-4 py-2 rounded ${size === 'large' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          >
            Large
          </button>
        </div>

        <h2 className="font-semibold mb-2">カラー:</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {colors.map((c) => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className="px-3 py-1 rounded border shadow-sm flex items-center"
              style={{
                backgroundColor: color === c.value ? c.value : 'white',
                color: color === c.value ? (
                  ['#F59E0B', '#10B981'].includes(c.value) ? 'black' : 'white'
                ) : 'black',
                borderColor: c.value
              }}
            >
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: c.value }}></div>
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-8 bg-white shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-center">ローディング表示</h2>
        <div className="h-40 w-full flex items-center justify-center">
          <Loading size={size} color={color} />
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>※このページはローディングコンポーネントのテスト用です。</p>
        <p>実際のアプリケーションでは、データ取得中やページ遷移時などに表示されます。</p>
      </div>
    </div>
  );
}
