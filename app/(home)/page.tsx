import Container from "@/components/shared/Container";
// import Loading from "@/components/common/Loading";
import ProductCard from "@/app/(home)/components/ProductCard";
import { products } from "@/app/(home)/product";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Container>
        <ProductCard product={products[0]} />
      </Container>
    </div>
  );
}
