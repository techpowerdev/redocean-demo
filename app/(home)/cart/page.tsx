"use client";

import Container from "@/components/shared/Container";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import LineLogin from "../../features/auth/LineLogin";
import UserCart from "@/app/features/cart/UserCart";

export default function Cart() {
  const token = useCurrentUserStore((state) => state.token);

  if (!token) {
    return <LineLogin />;
  }

  // if (!userOrders || userOrders.length === 0) {
  //   return <NoOrder />;
  // }

  return (
    <Container>
      {/* <MobileContainer> */}
      {/* <CartClient /> */}
      <UserCart />
      {/* </MobileContainer> */}
    </Container>
  );
}
