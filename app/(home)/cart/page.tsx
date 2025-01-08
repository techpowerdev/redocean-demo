"use client";

import Container from "@/components/shared/Container";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import LineLogin from "@/app/features/auth/LineLogin";
import UserCart from "@/app/features/cart/UserCart";

export default function Cart() {
  const token = useCurrentUserStore((state) => state.token);

  if (!token) {
    return <LineLogin />;
  }

  return (
    <Container>
      <UserCart />
    </Container>
  );
}
