import { getProductById } from "@/services/productServices";
import ProductCard from "./ProductCard";
import { ProductType } from "@/types/productTypes";
// import { ProductType } from "@/types/fetchTypes";

type Props = {
  productId: string;
};

export default async function ProductContainer({ productId }: Props) {
  const response = await getProductById(productId);
  const product = response.data as ProductType;
  // const [product, setProduct] = useState<ProductType | null>(null);

  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const product: ProductType = await getProductById(productId);
  //     if (product) {
  //       setProduct(product);
  //     }
  //   };
  //   fetchProduct();
  // }, []);

  return product ? (
    <div>
      <ProductCard product={product} />
    </div>
  ) : (
    <div>ไม่พบสินค้า</div>
  );
}
