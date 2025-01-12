use crate::models;
use std::collections::HashMap;

const TIME_BONUS_WEIGHT: f64 = 0.3;
const CORRECT_BONUS_WEIGHT: f64 = 0.4;
const PERFECT_BONUS_WEIGHT: f64 = 0.3;

/*
 * 結果から、scoreとcoinを計算して返す。
 *
 * word_count: タイピングの問題数
 * correct_count: 正解数
 * incorrect_count: 不正解数
 * perfect: 一度もタイプミスをしなかった正解数
 * completion_time: かかった時間
 * total_limit_sec: 各問題に割り振られた制限時間の合計
 */
pub fn get_score_and_coin(
    word_count: i32,
    correct_count: i32,
    perfect_within_correct_count: i32,
    completion_time: i32,
    total_limit_sec: i32,
    shuting_total_score: i32,
) -> (i32, i32) {

    // 今回のスコアを計算
    let score = calc_base_score(
        word_count, 
        correct_count, 
        perfect_within_correct_count, 
        completion_time, 
        total_limit_sec
    );

    // 過去の実績と比較して新しい問題にチャンレンジしているか
    let challenge_bonus = get_challenge_bonus(shuting_total_score);

    // スコアをコインに変換
    let final_score = score.round() as i32;
    let coin = (score * challenge_bonus).round() as i32;

    (final_score, coin)
}

/* スコア評価
 * スコアの範囲( 0～100 )
 *
 * 評価要素
 * completion_time / total_limit_sec の結果0%に近いほど高評価
 * correct_count / word_count の結果100%に近いほど高評価
 * perfect_within_correct_count / correct_count の結果100%に近いほど高評価
 */
fn calc_base_score(
    word_count: i32,
    correct_count: i32,
    perfect_within_correct_count: i32,
    completion_time: i32,
    total_limit_sec: i32,
) -> f64 {

    let time_bonus = 1.0 - (completion_time as f64 / total_limit_sec as f64);
    let correct_bonus = correct_count as f64 / word_count as f64;
    let perfect_bonus = if correct_count as f64 > 0.0 {
        perfect_within_correct_count as f64 / correct_count as f64
    } else {
        0.0
    };

    let raw_score = (time_bonus * TIME_BONUS_WEIGHT
        + correct_bonus * CORRECT_BONUS_WEIGHT
        + perfect_bonus * PERFECT_BONUS_WEIGHT) 
        * 100.0;

    raw_score
}

/*
 * チャレンジボーナス
 * トータルスコアが多いと、ボーナス比率が下がる。
 */
fn get_challenge_bonus(shuting_total_score: i32) -> f64 {
    // (トータルスコア範囲 : 倍率)
    let challenge_bonus_table = vec![
        (1000, 1.0),
        (800, 1.2),
        (500, 1.3),
        (300, 1.5),
        (100, 2.0),
        (0, 3.0), 
    ];

    for &(threshold, multiplier) in challenge_bonus_table.iter() {
        if shuting_total_score >= threshold {
            return multiplier;
        }
    }

    1.0
}
