export type Word = {
  word?: string | undefined | null;
  limit_sec: number;
};

export type Shuting = {
  id: number;
  level: number;
  description: string;
  words: Word[];
};
