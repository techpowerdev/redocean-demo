import ShowEventCard from "../../features/dashboard/ShowEventCard";
import { getPromotionToday } from "@/services/promotionServices";
import NoPromotion from "@/app/features/promotion/NoPromotion";
import { FetchAllPromotionResponseType } from "@/types/promotionTypes";

export default async function dashboard() {
  const promotions: FetchAllPromotionResponseType = await getPromotionToday();

  if (!promotions?.data || promotions.data.length === 0) {
    return <NoPromotion />;
  }

  return (
    <div className="flex-grow p-6 md:overflow-y-auto md:px-12 md:py-6">
      <h1 className={`mb-4 text-xl md:text-2xl`}>กิจกรรมวันนี้</h1>
      {promotions.data?.map((promotion) => (
        <div key={promotion.id}>
          <ShowEventCard promotion={promotion} />
        </div>
      ))}
    </div>
  );
}
