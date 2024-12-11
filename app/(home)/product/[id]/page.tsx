import ProductContainer from "@/app/features/product/ProductContainer";
import { getAllProducts, getProductById } from "@/services/productServices";
import { ProductType } from "@/types/fetchTypes";

type Props = {
  params: { id: string };
  // searchParams: { [key: string]: string | string[] | undefined };
};
export default async function page({ params }: Props) {
  const product: ProductType = await getProductById(params.id);
  const products: ProductType[] = await getAllProducts();

  // console.log(product);

  console.log(products);
  return (
    <div>
      <div>product: {product.promotionActivities?.map((item) => item.id)}</div>

      <ProductContainer productId={params.id} />
    </div>
  );
}
