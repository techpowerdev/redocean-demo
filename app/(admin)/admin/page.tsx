import { getPromotions } from "@/services/promotionServices";
import NoPromotion from "@/app/features/promotion/NoPromotion";
import PromotionOrderSummary from "@/app/features/dashboard/PromotionOrderSummary";
import { Separator } from "@/components/ui/separator";
import FlashSaleHeader from "@/app/features/flash-sale/FlashSaleHeader";
import GroupBuyHeader from "@/app/features/flash-sale/GroupBuyHeader";

export default async function dashboard() {
  const promotions = await getPromotions("today");

  if (!promotions?.data || promotions.data.length === 0) {
    return <NoPromotion />;
  }

  return (
    <div className="flex-grow p-2 md:overflow-y-auto md:p-4">
      <h1 className="mb-4 text-xl md:text-2xl">กิจกรรมวันนี้</h1>
      {promotions.data?.map((promotion) => (
        <div key={promotion.id}>
          <div className="w-full flex gap-2 justify-between items-center">
            {promotion.type === "flashsale" ? (
              <FlashSaleHeader promotion={promotion} />
            ) : (
              <GroupBuyHeader promotion={promotion} />
            )}
          </div>
          {promotion.promotionActivities?.map((promotionActivity) => (
            <div key={promotionActivity.id}>
              {/* <ShowEventCard promotion={promotionActivity.promotion} /> */}
              {promotionActivity.promotion?.startAt}
              <PromotionOrderSummary promotionActivity={promotionActivity} />
            </div>
          ))}
          <Separator className="my-6" />
        </div>
      ))}
    </div>
  );
}
