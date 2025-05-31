"use client";

import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Promotion } from "@/types/baseTypes";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { PromotionCountdown } from "./PromotionCountdown";
import { formatDateTimePromotion } from "@/utils/formatDate";
import SliderContainer from "@/components/shared/SliderContainer";

type Props = {
  promotions: Promotion[];
};
export function ShowUpcomingPromotion({ promotions }: Props) {
  return (
    <div>
      <SliderContainer
        breakpoints={{
          2000: { perPage: 3 },
          768: { perPage: 2, arrows: false },
          480: { perPage: 1, arrows: false },
        }}
      >
        {promotions.map((promotion) => (
          <div
            key={promotion.id}
            className="relative bg-white w-full h-48 rounded-lg overflow-hidden"
          >
            <div className="w-full absolute top-0 left-1/2 -translate-x-1/2 bg-green-300 opacity-80 p-2">
              <PromotionCountdown
                startTime={formatDateTimePromotion(promotion.startAt)}
                endTime={formatDateTimePromotion(promotion.endAt)}
                showDataTimeDetail={false}
                showTimeUnit={false}
              />
            </div>
            <ResponsiveImage
              src={
                promotion?.images && promotion.images.length > 0
                  ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${promotion.images?.[0]?.id}
                  `
                  : "/no-image.png"
              }
              alt={`promotion-${promotion.id}`}
            />
          </div>
        ))}
      </SliderContainer>
    </div>
  );
}
