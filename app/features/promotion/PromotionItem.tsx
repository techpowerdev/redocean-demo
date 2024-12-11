import { PromotionType } from "@/types/fetchTypes";
import React from "react";
import { PromotionCountdown } from "./PromotionCountdown";
import { formatDateTimePromotion } from "@/utils/formatDate";
import ProductContainer from "../product/ProductContainer";

type Props = {
  promotion: PromotionType;
};

export default function PromotionItem({ promotion }: Props) {
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
          <ProductContainer productId={activity.product.id} />
        </div>
      ))}
    </div>
  );
}
