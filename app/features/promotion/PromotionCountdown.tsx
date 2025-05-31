"use client";

import { AlarmClock, AlarmClockOff } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CountdownProps {
  startTime: string; // start time in "DD/MM/YYYY, HH:MM" format
  endTime: string; // end time in "DD/MM/YYYY, HH:MM" format
  showDataTimeDetail?: boolean;
  showTimeUnit?: boolean;
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

export const PromotionCountdown: React.FC<CountdownProps> = ({
  startTime,
  endTime,
  showDataTimeDetail = false,
  showTimeUnit = true,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({});
  const [hasStarted, setHasStarted] = useState(false); // Track if countdown has started
  const [hasEnded, setHasEnded] = useState(false); // Track if countdown has ended

  // useEffect(() => {
  //   const start = parseDateString(startTime);
  //   const end = parseDateString(endTime);

  //   const timer = setInterval(() => {
  //     const currentTime = new Date();

  //     if (currentTime >= start && currentTime < end) {
  //       setHasStarted(true);
  //       setTimeLeft(calculateTimeLeft(end));
  //     } else if (currentTime >= end) {
  //       setHasEnded(true);
  //       clearInterval(timer); // Stop countdown when time is up
  //     } else {
  //       setTimeLeft(calculateTimeLeft(start));
  //       setHasStarted(false);
  //     }
  //   }, 100);

  //   return () => clearInterval(timer);
  // }, [startTime, endTime]);

  useEffect(() => {
    const start = parseDateString(startTime);
    const end = parseDateString(endTime);

    const updateTime = () => {
      const currentTime = new Date();

      if (currentTime >= start && currentTime < end) {
        setHasStarted(true);
        setHasEnded(false);
        setTimeLeft(calculateTimeLeft(end));
      } else if (currentTime >= end) {
        setHasEnded(true);
        setHasStarted(false);
        setTimeLeft({});
      } else {
        setHasStarted(false);
        setHasEnded(false);
        setTimeLeft(calculateTimeLeft(start));
      }
    };

    updateTime(); // 👈 เรียกทันทีเมื่อ props เปลี่ยนก่อน 1 ครั้ง

    const timer = setInterval(updateTime, 1000); // แล้วเรียกทุก ๆ วินาที

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const padNumber = (num?: number): string => {
    return num !== undefined ? String(num).padStart(2, "0") : "00";
  };

  const timeUnits = ["วัน", "ชั่วโมง", "นาที", "วินาที"];
  const timeValues = [
    padNumber(timeLeft.days),
    padNumber(timeLeft.hours),
    padNumber(timeLeft.minutes),
    padNumber(timeLeft.seconds),
  ];

  const timerComponents = timeValues.map((value, index) => (
    <div
      key={timeUnits[index]}
      className="relative flex flex-col items-center mx-1"
    >
      <span className="inline-block rounded-sm bg-foreground text-white text-center text-sm w-8 py-1">
        {value}
      </span>
      {showTimeUnit && (
        <span className="text-xs font-semibold text-foreground mt-1">
          {timeUnits[index]}
        </span>
      )}
    </div>
  ));

  return (
    <div>
      {hasEnded ? (
        <span className="flex justify-start items-center gap-1 mb-1 text-red-500">
          <AlarmClockOff /> หมดเวลาแล้ว!
        </span>
      ) : (
        timerComponents.length > 0 && (
          <div className="flex flex-col items-center gap-y-1">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-medium">
                {hasStarted ? "หมดเวลาในอีก" : "เริ่มในอีก"}
              </span>
              <div className="flex"> {timerComponents}</div>
            </div>
            {showDataTimeDetail && (
              <span className="text-xs text-gray-500 flex justify-center items-center gap-1 mb-1">
                {hasStarted ? (
                  <>
                    <AlarmClock /> ปิด: {endTime}
                  </>
                ) : (
                  <>
                    <AlarmClock /> เปิด : {startTime}
                  </>
                )}
              </span>
            )}
          </div>
        )
      )}
    </div>
  );
};
