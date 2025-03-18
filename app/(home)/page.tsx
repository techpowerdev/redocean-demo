import Container from "@/components/shared/Container";
import PromotionList from "@/app/features/promotion/PromotionList";
import {
  getPromotionToday,
  getUpcomingPromotion,
} from "@/services/promotionServices";
import NoPromotion from "@/app/features/promotion/NoPromotion";
import HeroBanner from "@/app/features/banner/HeroBanner";
import { getAllBanners } from "@/services/bannerServices";
import { ShowUpcomingPromotion } from "@/app/features/promotion/ShowUpcomingPromotion";

export const dynamic = "force-dynamic";

export default async function Home() {
  const banners = await getAllBanners();
  const promotions = await getPromotionToday();
  const upcomingPromotions = await getUpcomingPromotion();

  return (
    <Container>
      {banners?.data.length > 0 && <HeroBanner banners={banners.data} />}
      {!promotions?.data || promotions.data.length === 0 ? (
        <NoPromotion />
      ) : (
        <PromotionList promotions={promotions.data} />
      )}

      {upcomingPromotions.data.length > 0 && (
        <div className="flex flex-col justify-center items-center gap-3 p-10">
          <h1 className="font-semibold text-red-500 text-lg">
            กิจกรรมที่กำลังจะมาถึงในเร็วๆนี้
          </h1>
          <ShowUpcomingPromotion promotions={upcomingPromotions.data} />
        </div>
      )}
    </Container>
  );
}
