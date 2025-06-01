import FlashSaleHeader from "@/app/features/flash-sale/FlashSaleHeader";
import PromotionClient from "@/app/features/flash-sale/PromotionClient";
import { getPromotions } from "@/services/promotionServices";
import React from "react";

export default async function page() {
  const promotions = await getPromotions("today");

  const filteredFlashsalePromotions = promotions?.data.filter(
    (promotion) => promotion?.type === "flashsale"
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      {filteredFlashsalePromotions?.length ? (
        <PromotionClient
          HeaderComponent={FlashSaleHeader}
          promotions={filteredFlashsalePromotions}
        />
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          ยังไม่มีโปรโมชั่น Flash sale
        </div>
      )}
    </div>
  );
}
