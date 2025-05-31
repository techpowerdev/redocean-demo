import React from "react";
import { getProductItemById } from "@/services/productServices";
import ProductItemWithDetail from "./ProductItemWithDetail";
import { getProductPromotionActivity } from "@/services/promotionActivityServices";

type Props = {
  searchParams: {
    promotionId: string;
    productItemId: string;
  };
  params: { id: string };
};
// export const dynamic = "force-dynamic";

export default async function page({ params, searchParams }: Props) {
  const { id } = params;
  const { promotionId } = searchParams;
  const product = await getProductItemById(id);

  const promotionActivity = await getProductPromotionActivity(
    promotionId || "",
    id
  );

  if (!product || !product.data) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <ProductItemWithDetail
        product={product.data}
        promotionActivity={promotionActivity.data}
      />
    </div>
  );
}
