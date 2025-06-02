"use client";

import OrderList from "@/app/features/order/OrderList";
import Container from "@/components/shared/Container";

export default function Orders() {
  return (
    <Container>
      {/* <MobileContainer> */}

      <OrderList />

      {/* </MobileContainer> */}
    </Container>
  );
}
