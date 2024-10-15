"use client";
import Container from "@/components/common/Container";
// import Loading from "@/components/common/Loading";
import ProductCard from "@/components/home/ProductCard";
import { products } from "@/mockup/product";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Container>
        <ProductCard product={products[2]} />
      </Container>
      {/* <div className="fixed top-0 left-0 w-full h-screen justify-center items-center">
        <Loading />
      </div> */}
    </div>
  );
}
