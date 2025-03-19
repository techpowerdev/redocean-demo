"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Promotion } from "@/types/baseTypes";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { PromotionCountdown } from "./PromotionCountdown";
import { formatDateTimePromotion } from "@/utils/formatDate";

type Props = {
  promotions: Promotion[];
};
export function ShowUpcomingPromotion({ promotions }: Props) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {promotions.map((promotion) => (
          <CarouselItem key={promotion.id}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center p-2">
                <div>
                  <PromotionCountdown
                    startTime={formatDateTimePromotion(promotion.startAt)}
                    endTime={formatDateTimePromotion(promotion.endAt)}
                  />
                  <ResponsiveImage
                    src={
                      process.env.NEXT_PUBLIC_IMAGE_HOST_URL +
                      (promotion.images?.[0].url || "")
                    }
                    alt={`promotion-${promotion.id}`}
                  />
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
