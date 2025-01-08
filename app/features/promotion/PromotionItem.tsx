"use client";

import React, { useEffect, useState } from "react";
import { PromotionCountdown } from "@/app/features/promotion/PromotionCountdown";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { PromotionType } from "@/types/promotionTypes";
import PromotionProductCard from "@/app/features/promotion/PromotionProductCard";

type Props = {
  promotion: PromotionType;
};

export default function PromotionItem({ promotion }: Props) {
  const { startAt, endAt } = promotion;
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const now = new Date().getTime();
    const startTime = new Date(startAt).getTime();
    const endTime = new Date(endAt).getTime();

    if (now >= startTime && now <= endTime) {
      // Promotion is active
      setIsActive(true);

      // Schedule deactivation when the promotion ends
      const timeUntilEnd = endTime - now;
      const endTimeout = setTimeout(() => setIsActive(false), timeUntilEnd);

      return () => clearTimeout(endTimeout); // Cleanup timeout on unmount
    } else if (now < startTime) {
      // Schedule activation
      const timeUntilStart = startTime - now;
      const startTimeout = setTimeout(() => setIsActive(true), timeUntilStart);

      // Schedule deactivation when the promotion ends
      const timeUntilEnd = endTime - startTime;
      const endTimeout = setTimeout(
        () => setIsActive(false),
        timeUntilEnd + timeUntilStart
      );

      return () => {
        clearTimeout(startTimeout);
        clearTimeout(endTimeout); // Cleanup timeouts on unmount
      };
    } else {
      // Promotion has ended
      setIsActive(false);
    }
  }, [startAt, endAt]);

  return (
    <div>
      {promotion.promotionActivities?.map((activity) => (
        <div key={activity.id}>
          <div className="grid grid-cols-1 md:grid-cols-2 md:items-center gap-4 md:gap-16 p-2 bg-green-400">
            <div className="flex flex-row justify-between items-center gap-2 text-sm">
              <h1 className="text-xl font-bold">
                {promotion.type === "flashsale"
                  ? "กิจกรรมลดราคาประจำเดือน"
                  : "กิจกรรมรวมออเดอร์"}
              </h1>
            </div>
            <PromotionCountdown
              startTime={formatDateTimePromotion(promotion.startAt)}
              endTime={formatDateTimePromotion(promotion.endAt)}
            />
          </div>
          {activity.product && (
            <PromotionProductCard
              promotion={promotion}
              isActive={isActive}
              promotionActivity={activity}
              product={activity.product}
            />
          )}
        </div>
      ))}
    </div>
  );
}
