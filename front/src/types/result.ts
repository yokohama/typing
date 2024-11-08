export type ResultData = {
    id: number;
    user_id: number;
    lesson_id: number;
    score: number;
    time: number;
    answer: string;
    lesson_title: string;
    lesson_example: string;
    created_at: Date
};

export type ResultTableProps = {
  result: ResultData;
};

export type RecordsProps = {
  records: ResultData[];
}
