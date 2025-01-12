export type Result = {
    id: number | undefined;
    user_id: number | undefined;
    shuting_id: number;
    score: number;
    correct_count: number;
    incorrect_count: number;
    time: number;
    perfect_count: number;
    time_bonus: number;
    coin: number | undefined | null;
    created_at: Date | undefined;
};

export type RecordsProps = {
  records: Result[];
}
