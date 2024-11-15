export type ResultData = {
    id: number;
    user_id: number;
    level: number;
    score: number;
    time: number;
    perfect_count: number;
    time_bonus: number;
    created_at: Date
};

export type ResultTableProps = {
  result: ResultData;
};

export type RecordsProps = {
  records: ResultData[];
}
