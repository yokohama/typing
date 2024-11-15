export type ShutingData = {
  id: number;
  limit_sec: number;
  word: string;
}

export type Result = {
  corrects: number;
  incorrects: number;
  time: number;
}
