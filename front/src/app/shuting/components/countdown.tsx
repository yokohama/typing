import { useState, useEffect } from "react";

import { OverlayVisible } from "@/app/shuting/components/overlay";

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
        <OverlayVisible>
          <span className="
            text-white
            font-bold
            text-[10rem] lg:text-[20rem]
          ">{countdown}</span>
        </OverlayVisible>
      )}
    </>
  );
}
