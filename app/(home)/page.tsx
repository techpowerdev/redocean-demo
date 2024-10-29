import Container from "@/components/shared/Container";
import ProductCard from "@/app/(home)/components/ProductCard";
import { products } from "@/app/(home)/product";
// import CheckLogined from "./CheckLogined";

export default async function Home() {
  return (
    // <MobileContainer>
    // {/* <CheckLogined /> */}
    <div className="flex flex-col gap-4 items-center">
      <Container>
        <ProductCard product={products[0]} />
      </Container>
    </div>
    // </MobileContainer>
  );
}
