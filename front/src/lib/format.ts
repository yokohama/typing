export const FormatSecTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分 ${remainingSeconds.toString().padStart(2, '0')}秒`;
};

export const FormatDateTime = (dateTime: Date | string | number): string => {
  return new Date(dateTime).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year:     'numeric',
    month:    '2-digit',
    day:      '2-digit',
    hour:     '2-digit',
    minute:   '2-digit',
    hour12:   false
  });
};

/*
 * jsの型をAPIに合わせた方に変換する。
 */
export const formatToNaiveDateTime = (date: Date): string => {
  return date.toISOString().replace("Z", "").split(".")[0];
};
