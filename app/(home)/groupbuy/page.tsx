import GroupBuyHeader from "@/app/features/flash-sale/GroupBuyHeader";
import PromotionClient from "@/app/features/flash-sale/PromotionClient";
import { getPromotions } from "@/services/promotionServices";
import React from "react";

export default async function page() {
  const promotions = await getPromotions("today");

  const filteredGroupBuyPromotions = promotions?.data.filter(
    (promotion) => promotion?.type === "groupbuying"
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {filteredGroupBuyPromotions?.length ? (
        <PromotionClient
          HeaderComponent={GroupBuyHeader}
          promotions={filteredGroupBuyPromotions}
        />
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          ยังไม่มีโปรโมชั่น Group Buy
        </div>
      )}
    </div>
  );
}
