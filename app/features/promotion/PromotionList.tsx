import { PromotionType } from "@/types/fetchTypes";
import PromotionItem from "./PromotionItem";

type Props = {
  promotions: PromotionType[];
};

export default function PromotionList({ promotions }: Props) {
  return (
    <div>
      {promotions?.map((promotion: PromotionType) => (
        <div key={promotion.id}>
          <PromotionItem promotion={promotion} />
        </div>
      ))}
    </div>
  );
}
