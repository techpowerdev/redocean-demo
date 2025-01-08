import PromotionItem from "@/app/features/promotion/PromotionItem";
import SocialShare from "@/app/features/social-share/SocialShare";
import { PromotionType } from "@/types/promotionTypes";

type Props = {
  promotions: PromotionType[];
};

export default function PromotionList({ promotions }: Props) {
  return (
    <div>
      {promotions?.map((promotion) => (
        <div key={promotion.id}>
          <PromotionItem promotion={promotion} />
          <SocialShare
            shareTitle={promotion.name}
            shareDescription={promotion.description}
            shareUrl={`${process.env.NEXT_PUBLIC_CLIENT_HOST_URL}/promotion/${promotion.id}`}
          />
        </div>
      ))}
    </div>
  );
}
