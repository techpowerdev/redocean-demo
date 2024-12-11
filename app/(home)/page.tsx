import Container from "@/components/shared/Container";
import PromotionList from "../features/promotion/PromotionList";
import { getPromotionToday } from "@/services/promotionServices";
import NoPromotion from "../features/promotion/NoPromotion";
import HeroBanner from "../features/banner/HeroBanner";
import Campaign from "../features/social-share/Campaign";

export default async function Home() {
  const promotions = await getPromotionToday();
  return (
    <Container>
      <HeroBanner />
      {promotions?.data?.[0] && <Campaign promotion={promotions?.data?.[0]} />}
      {!promotions?.data || promotions.data.length === 0 ? (
        <NoPromotion />
      ) : (
        <PromotionList promotions={promotions.data} />
      )}
    </Container>
  );
}
