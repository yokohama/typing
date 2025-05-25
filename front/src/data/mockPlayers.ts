export type Player = {
  id: string;
  name: string;
  avatarUrl: string | null; // nullを許可
  totalScore: number;
};

// モックプレーヤーデータ - アバターURLをnullに設定してInitialAvatarを使用
export const mockPlayers: Player[] = [
  {
    id: "1",
    name: "タイピングマスター",
    avatarUrl: null, // Gravatar風アバターを使用
    totalScore: 9850,
  },
  {
    id: "2",
    name: "キーボードウィザード",
    avatarUrl: null,
    totalScore: 8720,
  },
  {
    id: "3",
    name: "入力スピードキング",
    avatarUrl: null,
    totalScore: 8450,
  },
  {
    id: "4",
    name: "文字入力の達人",
    avatarUrl: null,
    totalScore: 7930,
  },
  {
    id: "5",
    name: "高速タイピスト",
    avatarUrl: null,
    totalScore: 7820,
  },
  {
    id: "6",
    name: "指の舞ニンジャ",
    avatarUrl: null,
    totalScore: 7650,
  },
  {
    id: "7",
    name: "キーストローク女王",
    avatarUrl: null,
    totalScore: 7520,
  },
  {
    id: "8",
    name: "タイピングチャンピオン",
    avatarUrl: null,
    totalScore: 7350,
  },
  {
    id: "9",
    name: "キーボードサムライ",
    avatarUrl: null,
    totalScore: 7220,
  },
  {
    id: "10",
    name: "文字の魔術師",
    avatarUrl: null,
    totalScore: 7080,
  },
  {
    id: "11",
    name: "クイックフィンガー",
    avatarUrl: null,
    totalScore: 6950,
  },
  {
    id: "12",
    name: "キーの騎士",
    avatarUrl: null,
    totalScore: 6830,
  },
  {
    id: "13",
    name: "スピードタイパー",
    avatarUrl: null,
    totalScore: 6710,
  },
  {
    id: "14",
    name: "フラッシュタイピスト",
    avatarUrl: null,
    totalScore: 6580,
  },
  {
    id: "15",
    name: "キーボードマエストロ",
    avatarUrl: null,
    totalScore: 6460,
  },
  {
    id: "16",
    name: "タイプスター",
    avatarUrl: null,
    totalScore: 6330,
  },
  {
    id: "17",
    name: "入力の魔法使い",
    avatarUrl: null,
    totalScore: 6210,
  },
  {
    id: "18",
    name: "キーボードレンジャー",
    avatarUrl: null,
    totalScore: 6080,
  },
  {
    id: "19",
    name: "文字の戦士",
    avatarUrl: null,
    totalScore: 5950,
  },
  {
    id: "20",
    name: "指先の芸術家",
    avatarUrl: null,
    totalScore: 5830,
  }
];
