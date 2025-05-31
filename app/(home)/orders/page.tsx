"use client";

import OrderList from "@/app/features/order/OrderList";
// import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
// import LineLogin from "@/app/features/auth/LineLogin";
import Heading from "@/components/shared/Heading";
import { FileClock } from "lucide-react";
import Container from "@/components/shared/Container";

export default function Orders() {
  // const currentUser = useCurrentUserStore((state) => state.currentUser);

  // if (!currentUser) {
  //   return <LineLogin />;
  // }

  return (
    <Container>
      {/* <MobileContainer> */}

      <OrderList />

      {/* </MobileContainer> */}
    </Container>
  );
}
