<<<<<<< HEAD
export type ResultData = {
    id?: number;
    user_id?: number;
    level?: number;
    score?: number;
    correct_count?: number;
    incorrect_count?: number;
    time?: number;
    perfect_count?: number;
    time_bonus?: number;
    created_at?: Date
=======
export type Result = {
    id: number;
    user_id: number;
    level: number;
    score: number;
    time: number;
    perfect_count: number;
    time_bonus: number;
    created_at: Date
>>>>>>> 1aa974f (init)
};

export type ResultTableProps = {
  result: Result;
};

export type RecordsProps = {
  records: Result[];
}
