"use client";

import OrderList from "../../features/order/OrderList";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import LineLogin from "@/app/features/auth/LineLogin";
import Heading from "@/components/shared/Heading";
import { FileClock } from "lucide-react";
import Container from "@/components/shared/Container";

export default function Orders() {
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  if (!currentUser) {
    return <LineLogin />;
  }

  return (
    <Container>
      {/* <MobileContainer> */}
      <div className="flex justify-between items-center gap-4 py-2 mb-2 ">
        <Heading title="ประวัติการสั่งซื้อ" center />
        <FileClock size={30} className="text-gray-300" />
      </div>
      <div className="flex flex-col space-y-2">
        <OrderList />
      </div>
      {/* </MobileContainer> */}
    </Container>
  );
}
