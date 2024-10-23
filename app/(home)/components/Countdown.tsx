"use client";

import { AlarmClock, AlarmClockOff } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string; // The target date as a string
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

const calculateTimeLeft = (targetDate: string): TimeLeft => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft: TimeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});
  const [hasEnded, setHasEnded] = useState(false); // Add a state to track if countdown has ended

  useEffect(() => {
    const timer = setInterval(() => {
      const timeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(timeLeft);

      // Check if countdown has ended
      if (Object.keys(timeLeft).length === 0) {
        setHasEnded(true); // Set countdown as ended
        clearInterval(timer); // Clear the interval once the countdown is over
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents: JSX.Element[] = [];

  // Helper function to pad numbers with leading zeros
  const padNumber = (num?: number): string => {
    return num !== undefined ? String(num).padStart(2, "0") : "00";
  };

  Object.keys(timeLeft).forEach((interval) => {
    const key = interval as keyof TimeLeft; // Type assertion to use as a key
    if (timeLeft[key] !== undefined) {
      timerComponents.push(
        <span key={key}>
          <span className="inline-block rounded-sm bg-foreground text-white text-center text-sm w-8 py-1 mx-1">
            {padNumber(timeLeft[key])}
          </span>
          {key !== "seconds" ? <span className="text-foreground">:</span> : ""}
        </span>
      );
    }
  });

  return (
    <div>
      {hasEnded ? (
        <span className="flex justify-center items-center gap-1 mb-1 text-gray-400">
          <AlarmClockOff /> หมดเวลาแล้ว!
        </span>
      ) : (
        Object.keys(timeLeft).length > 0 &&
        timerComponents.length > 0 && (
          <div className="flex flex-col items-start gap-y-1">
            <span className="flex justify-center items-center gap-1 mb-1">
              <AlarmClock /> เปิด : {targetDate}
            </span>
            <div>เหลือเวลาอีก {timerComponents}</div>
          </div>
        )
      )}
    </div>
  );
};
