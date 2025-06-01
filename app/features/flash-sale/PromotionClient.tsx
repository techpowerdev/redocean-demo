"use client";

import { useEffect, useState } from "react";
import { Promotion } from "@/types/baseTypes";
import TimeSlots from "./TimeSlots";
import ProductCard from "./ProductCard";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";
import {
  getNearestPromotion,
  getSortedUniqueStartTimes,
} from "@/utils/promotionUtils";
import Container from "@/components/shared/Container";

export type TimeSlot = {
  startAt: string;
  endAt: string;
};

type Props = {
  HeaderComponent: (props: { promotion: Promotion }) => JSX.Element; // flashsale/groupbuy header
  promotions: Promotion[];
};
export default function PromotionClient({
  HeaderComponent,
  promotions,
}: Props) {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(
    null
  );

  const [filteredPromotions, setFilteredPromotions] =
    useState<Promotion[]>(promotions);

  const products = filteredPromotions?.flatMap(
    (promotion) =>
      promotion?.promotionActivities?.map((activity) => ({
        id: activity.productItem?.id || "",
        name: activity.productItem?.name || "",
        image: activity.productItem?.images?.[0] || "",
        originalPrice:
          activity.productItem?.originalPrice ||
          activity?.productItem?.models?.[0].originalPrice ||
          0,
        discount: activity.discountAmount || 0,
        discountType: activity.discountType || "",
        discountedPrice: calculateDiscountedPrice(
          activity.productItem?.originalPrice ||
            activity?.productItem?.models?.[0].originalPrice ||
            0,
          activity.discountAmount || 0,
          activity.discountType || ""
        ).discountedPrice,
        promotionId: promotion.id,
        promotionActivityId: activity.id,
      })) || []
  );

  console.log(products);
  /**
   * เลือกโปรโมชั่นที่ใช้งานอยู่ หรือใกล้เริ่มที่สุด
   */
  const nearestPromotion = getNearestPromotion(promotions);

  // Get unique start times
  const times = getSortedUniqueStartTimes(promotions);

  useEffect(() => {
    if (selectedTimeSlot) {
      const list = promotions.filter(
        (p) => p.startAt === selectedTimeSlot.startAt
      );
      setFilteredPromotions(list);
    } else if (nearestPromotion) {
      // If no time slot is selected, show the nearest promotion
      setFilteredPromotions(nearestPromotion ? [nearestPromotion] : promotions);
      setSelectedTimeSlot({
        startAt: nearestPromotion.startAt,
        endAt: nearestPromotion.endAt,
      });
    }
  }, [selectedTimeSlot]);

  return (
    <div>
      {/* Header */}
      <HeaderComponent promotion={filteredPromotions?.[0]} />

      {/* Time Slots */}
      <TimeSlots
        timeSlots={times}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
      />
      {/* Product Grid */}
      <Container>
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products?.map(
            (product) =>
              product && (
                <ProductCard
                  key={product.id}
                  product={product}
                  promotionId={product.promotionId}
                />
              )
          )}
        </div>
      </Container>
    </div>
  );
}
