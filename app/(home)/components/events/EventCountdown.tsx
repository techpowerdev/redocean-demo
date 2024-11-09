"use client";

import { AlarmClock, AlarmClockOff } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CountdownProps {
  startTime: string; // start time in "DD/MM/YYYY, HH:MM" format
  endTime: string; // end time in "DD/MM/YYYY, HH:MM" format
}

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

// Convert date from "DD/MM/YYYY, HH:MM" to Date object
const parseDateString = (dateString: string): Date => {
  const [datePart, timePart] = dateString.split(", ");
  const [day, month, year] = datePart.split("/").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(year - 543, month - 1, day, hours, minutes); // Adjust Buddhist year to Gregorian year
};

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const difference = +targetDate - +new Date();
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

export const EventCountdown: React.FC<CountdownProps> = ({
  startTime,
  endTime,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});
  const [hasStarted, setHasStarted] = useState(false); // Track if countdown has started
  const [hasEnded, setHasEnded] = useState(false); // Track if countdown has ended

  useEffect(() => {
    const start = parseDateString(startTime);
    const end = parseDateString(endTime);

    const timer = setInterval(() => {
      const currentTime = new Date();

      if (currentTime >= start && currentTime < end) {
        setHasStarted(true);
        setTimeLeft(calculateTimeLeft(end));
      } else if (currentTime >= end) {
        setHasEnded(true);
        clearInterval(timer); // Stop countdown when time is up
      } else {
        setTimeLeft(calculateTimeLeft(start));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const timerComponents: JSX.Element[] = [];

  // Pad numbers with leading zeros
  const padNumber = (num?: number): string => {
    return num !== undefined ? String(num).padStart(2, "0") : "00";
  };

  Object.keys(timeLeft).forEach((interval) => {
    const key = interval as keyof TimeLeft;
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
      ) : hasStarted ? (
        timerComponents.length > 0 && (
          <div className="flex flex-col items-start gap-y-1">
            <span className="flex justify-center items-center gap-1 mb-1">
              <AlarmClock /> ปิด : {endTime}
            </span>
            <div>เหลือเวลาอีก {timerComponents}</div>
          </div>
        )
      ) : (
        timerComponents.length > 0 && (
          <div className="flex flex-col items-start gap-y-1">
            <span className="flex justify-center items-center gap-1 mb-1">
              <AlarmClock /> เปิด : {startTime}
            </span>
            <div>นับถอยหลังถึงเวลาเปิด {timerComponents}</div>
          </div>
        )
      )}
    </div>
  );
};
