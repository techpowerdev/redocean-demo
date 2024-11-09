"use client";

import OrderClient from "./components/OrderClient";
import MobileContainer from "@/components/shared/MobileContainer";

export default function page() {
  return (
    <MobileContainer>
      <OrderClient />
    </MobileContainer>
  );
}
