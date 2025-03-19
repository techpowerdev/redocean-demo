import { getOneProductForSell } from "@/services/productServices";
import ProductCard from "@/app/features/product/ProductCard";

type Props = {
  productId: string;
};

export default async function ProductContainer({ productId }: Props) {
  const response = await getOneProductForSell(productId);
  const product = response.data;

  return product ? (
    <div>
      <ProductCard product={product} />
    </div>
  ) : (
    <div>ไม่พบสินค้า</div>
  );
}
