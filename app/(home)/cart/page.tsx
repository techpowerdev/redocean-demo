"use client";

import Container from "@/components/shared/Container";
import CartClient from "./components/CartClient";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import Loading from "@/components/shared/Loading";
import LineLogin from "../../../components/auth/LineLogin";
import MobileContainer from "@/components/shared/MobileContainer";

export default function Cart() {
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  const loading = useCurrentUserStore((state) => state.loading);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen justify-center items-center">
        <Loading size={40} />
      </div>
    );
  }

  return currentUser ? (
    <Container>
      <CartClient />
    </Container>
  ) : (
    <MobileContainer>
      <LineLogin />
    </MobileContainer>
  );
}
