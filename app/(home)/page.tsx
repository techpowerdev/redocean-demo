import Container from "@/components/shared/Container";
import ProductCard from "@/app/(home)/components/ProductCard";
import { products } from "@/app/(home)/product";
import { Countdown } from "./components/Countdown";
import EventList from "./components/events/EventList";
// import CheckLogined from "./CheckLogined";

export default async function Home() {
  const dated = "31/10/2024, 08:00:00";
  return (
    // <MobileContainer>
    // {/* <CheckLogined /> */}
    <div className="flex flex-col gap-4 items-center">
      <Container>
        {/* <ProductCard product={products[0]} /> */}
        <EventList />
      </Container>
    </div>
    // </MobileContainer>
  );
}
