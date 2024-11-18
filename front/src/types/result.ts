export type Result = {
    id: number | undefined;
    user_id: number | undefined;
    level: number;
    score: number;
    correct_count: number;
    incorrect_count: number;
    time: number;
    perfect_count: number;
    time_bonus: number;
    point: number | undefined | null;
    created_at: Date | undefined;
};

export type ResultTableProps = {
  result: Result;
};

export type RecordsProps = {
  records: Result[];
}
