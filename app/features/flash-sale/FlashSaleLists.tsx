"use client";

import { Promotion } from "@/types/baseTypes";
import FlashSaleHeader from "./FlashSaleHeader";
import ProductCard from "./ProductCard";
import { calculateDiscountedPrice } from "@/utils/calculateDiscountedPrice";
import { getNearestPromotion } from "@/utils/promotionUtils";
import Container from "@/components/shared/Container";
import SliderContainer from "@/components/shared/SliderContainer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type TimeSlot = {
  startAt: string;
  endAt: string;
};

type Props = {
  promotions: Promotion[];
};
export default function FlashSaleLists({ promotions }: Props) {
  const products = promotions?.flatMap(
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

  return (
    <div>
      <FlashSaleHeader promotion={nearestPromotion} />
      <Container>
        {/* Header */}

        <Link
          href={"/flashsale"}
          className="w-full flex flex-row items-center justify-end gap-2 my-2"
        >
          ดูทั้งหมด
          <span className="flex items-center justify-center bg-black w-8 h-8 rounded-full">
            <ChevronRight size={20} className="text-white" />
          </span>
        </Link>
        {/* Product Grid */}
        <div className="my-4">
          <SliderContainer>
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
          </SliderContainer>
        </div>
      </Container>
    </div>
  );
}
