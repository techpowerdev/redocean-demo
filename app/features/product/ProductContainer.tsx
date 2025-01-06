import { getOneProductForSell } from "@/services/productServices";
import ProductCard from "@/app/features/product/ProductCard";
import { FetchOneProductResponseType } from "@/types/productTypes";

type Props = {
  productId: string;
};

export default async function ProductContainer({ productId }: Props) {
  const response: FetchOneProductResponseType = await getOneProductForSell(
    productId
  );
  const product = response.data;

  return product ? (
    <div>
      <ProductCard product={product} />
    </div>
  ) : (
    <div>ไม่พบสินค้า</div>
  );
}
