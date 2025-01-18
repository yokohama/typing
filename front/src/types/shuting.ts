export type ShutingWord = {
  word?: string | undefined | null;
  limit_sec: number;
};

export type Shuting = {
  id: number;
  level: number;
  description: string;
  is_random: boolean;
  words: ShutingWord[];
};
