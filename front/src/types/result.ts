export type Result = {
    id: number | undefined;
    user_id: number | undefined;
    shuting_id: number;
    score: number;
    correct_count: number;
    incorrect_count: number;
    perfect_within_correct_count: number;
    completion_time: number;
    gain_coin: number | undefined | null;
    owned_coin?: number | undefined | null;
    total_gain_coin?: number | undefined | null;
    created_at: Date | undefined;
};

export type RecordsProps = {
  records: Result[];
}
