"use client";

import { formatDateTimePromotion } from "@/utils/formatDate";
import { Dispatch, SetStateAction } from "react";
import { TimeSlot } from "./FlashSaleLists";

type Props = {
  timeSlots: TimeSlot[];
  selectedTimeSlot: TimeSlot | null;
  setSelectedTimeSlot: Dispatch<SetStateAction<TimeSlot | null>>;
};
export default function TimeSlots({
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
}: Props) {
  function getPromotionStatus(
    startAt: Date | string,
    endAt: Date | string
  ): string {
    const now = new Date();
    const start = new Date(startAt);
    const end = new Date(endAt);

    if (now < start) return "เร็วๆ นี้";
    if (now >= start && now <= end) return "กำลังดำเนินอยู่";
    if (now > end) return "สิ้นสุดแล้ว";

    return "";
  }

  return (
    <div className="w-full bg-white rounded-b-md shadow-md flex items-center justify-between">
      {timeSlots.map((time, i) => (
        <button
          key={i}
          className={`text-xs sm:text-sm text-white cursor-pointer w-full h-full flex flex-col gap-1 p-2 ${
            selectedTimeSlot?.startAt === time.startAt
              ? "bg-primary"
              : "bg-gray-800"
          }`}
          onClick={() =>
            setSelectedTimeSlot({ startAt: time.startAt, endAt: time.endAt })
          }
        >
          <span>{formatDateTimePromotion(time.startAt).split(",")[1]}</span>
          <span>{getPromotionStatus(time.startAt, time.endAt)}</span>
        </button>
      ))}
    </div>
  );
}
