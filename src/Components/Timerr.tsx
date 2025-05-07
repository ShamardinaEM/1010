import { useState, useEffect } from "react";

export default function Timer({
  isGameOver,
  resetKey,
  isTimedMode,
  outOfTime
}: {
  isGameOver: boolean;
  resetKey: number;
  isTimedMode: boolean;
  outOfTime:() => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (isGameOver) return;

    if (isTimedMode) {
      setTimeLeft(10);
    }

    if (!isTimedMode) {
      setElapsed(0);
    }

    const interval = setInterval(() => {
      if (isTimedMode) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            outOfTime();
            return 0;
          }
          return prev - 1;
        });
      } else {
        setElapsed((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [resetKey, isTimedMode, isGameOver]);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div>
      {isTimedMode ? (
        <p>Оставшееся время: {formatTime(timeLeft)}</p>
      ) : (
        <p>Прошло времени: {formatTime(elapsed)}</p>
      )}
    </div>
  );
}
