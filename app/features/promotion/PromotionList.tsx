import { PromotionType } from "@/types/fetchTypes";
import PromotionItem from "./PromotionItem";
import SocialShare from "../social-share/SocialShare";

type Props = {
  promotions: PromotionType[];
};

export default function PromotionList({ promotions }: Props) {
  return (
    <div>
      {promotions?.map((promotion: PromotionType) => (
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
