import { useState, useEffect } from "react";

type CountdownProps = {
  isCountdownVisible: boolean;
  setIsCountdownVisible: React.Dispatch<React.SetStateAction<boolean>>;
  handleStart: () => void;
};

export default function Countdown({
  isCountdownVisible,
  setIsCountdownVisible,
  handleStart,
}: CountdownProps) {

  const [countdown, setCountdown] = useState<number>(3);

  useEffect(() => {
    if (countdown > 0) {
      const countdownTimer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(countdownTimer);
    } else {
      setIsCountdownVisible(false);
      handleStart();
    }
  }, [countdown]);

  return (
    <>
      {isCountdownVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <span className="text-white text-[10rem] font-bold">
            {countdown}
          </span>
        </div>
      )}
    </>
  );
}
