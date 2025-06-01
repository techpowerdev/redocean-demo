"use client";

import { Promotion } from "@/types/baseTypes";
import { PromotionCountdown } from "../promotion/PromotionCountdown";
import { formatDateTimePromotion } from "@/utils/formatDate";
import Container from "@/components/shared/Container";

type Props = {
  promotion: Promotion | null;
};

export default function GroupBuyHeader({ promotion }: Props) {
  return (
    <div className="w-full bg-orange-500">
      <Container>
        <div className="p-4 flex flex-col sm:flex-row items-center justify-between flex-wrap">
          <div className="flex items-center">
            <div className="text-white font-bold text-2xl mr-2">GROUP BUY</div>
            <div className="text-yellow-300 text-sm">รวมกันซื้อ ถูกกว่า</div>
          </div>
          {promotion && (
            <div className="bg-yellow-300 px-2 py-1 rounded-md">
              <PromotionCountdown
                startTime={formatDateTimePromotion(promotion.startAt)}
                endTime={formatDateTimePromotion(promotion.endAt)}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
