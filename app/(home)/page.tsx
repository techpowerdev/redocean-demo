import Container from "@/components/shared/Container";
import PromotionList from "@/app/features/promotion/PromotionList";
import { getPromotionToday } from "@/services/promotionServices";
import NoPromotion from "@/app/features/promotion/NoPromotion";
import HeroBanner from "@/app/features/banner/HeroBanner";
import { getAllBanners } from "@/services/bannerServices";
import { FetchAllBannersResponseType } from "@/types/bannerTypes";
import { FetchAllPromotionResponseType } from "@/types/promotionTypes";

export const dynamic = "force-dynamic";

export default async function Home() {
  const promotions: FetchAllPromotionResponseType = await getPromotionToday();
  const banners: FetchAllBannersResponseType = await getAllBanners();

  return (
    <Container>
      {banners?.data.length > 0 && <HeroBanner banners={banners.data} />}
      {!promotions?.data || promotions.data.length === 0 ? (
        <NoPromotion />
      ) : (
        <PromotionList promotions={promotions.data} />
      )}
    </Container>
  );
}
