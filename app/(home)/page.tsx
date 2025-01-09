"use client";

import Container from "@/components/shared/Container";
import PromotionList from "@/app/features/promotion/PromotionList";
import {
  getPromotionToday,
  getUpcomingPromotion,
} from "@/services/promotionServices";
import NoPromotion from "@/app/features/promotion/NoPromotion";
import HeroBanner from "@/app/features/banner/HeroBanner";
import { getAllBanners } from "@/services/bannerServices";
import { FetchAllBannersResponseType } from "@/types/bannerTypes";
import { FetchAllPromotionResponseType } from "@/types/promotionTypes";
import { ShowUpcomingPromotion } from "@/app/features/promotion/ShowUpcomingPromotion";

export const dynamic = "force-dynamic";

export default async function Home() {
  const promotions: FetchAllPromotionResponseType = await getPromotionToday();
  const upcomingPromotions: FetchAllPromotionResponseType =
    await getUpcomingPromotion();
  const banners: FetchAllBannersResponseType = await getAllBanners();

  return (
    <Container>
      {banners?.data.length > 0 && <HeroBanner banners={banners.data} />}
      {!promotions?.data || promotions.data.length === 0 ? (
        <NoPromotion />
      ) : (
        <PromotionList promotions={promotions.data} />
      )}

      <div className="flex flex-col justify-center items-center gap-3 p-10">
        <h1 className="font-semibold text-red-500 text-lg">
          กิจกรรมที่กำลังจะมาถึงในเร็วๆนี้
        </h1>
        <ShowUpcomingPromotion promotions={upcomingPromotions.data} />
      </div>
    </Container>
  );
}
