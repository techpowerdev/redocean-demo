import Container from "@/components/shared/Container";
import PromotionList from "../features/promotion/PromotionList";
import { getPromotionToday } from "@/services/promotionServices";
import NoPromotion from "../features/promotion/NoPromotion";
import HeroBanner from "../features/banner/HeroBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
  const promotions = await getPromotionToday();

  return (
    <Container>
      <HeroBanner />
      {!promotions?.data || promotions.data.length === 0 ? (
        <NoPromotion />
      ) : (
        <PromotionList promotions={promotions.data} />
      )}
    </Container>
  );
}
