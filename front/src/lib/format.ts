  export const FormatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分 ${remainingSeconds.toString().padStart(2, '0')}秒`;
  };

