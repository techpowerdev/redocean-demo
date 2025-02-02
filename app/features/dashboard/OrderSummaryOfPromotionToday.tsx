import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { getOrderSummaryOfGroupBuying } from "@/services/orderServices";
import {
  CircleCheckBig,
  CircleX,
  ClockArrowDown,
  LoaderCircle,
  ScrollText,
  Truck,
} from "lucide-react";
import { OrderSummaryReponseType, OrderSummaryType } from "@/types/orderTypes";

type Props = {
  promotionActivityId: string | null;
};

export default function OrderSummaryOfPromotionToday({
  promotionActivityId,
}: Props) {
  const [orderSummary, setOrderSummary] = useState<OrderSummaryType | null>(
    null
  );
  useEffect(() => {
    const fetchData = async () => {
      const orderSummary: OrderSummaryReponseType =
        await getOrderSummaryOfGroupBuying(promotionActivityId);
      setOrderSummary(orderSummary.data);
      console.log("orderSummary==", orderSummary);
    };
    fetchData();
  }, [promotionActivityId]);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
      <DashboardCard
        title="ทั้งหมด"
        value={orderSummary?.totalOrders || 0}
        Icon={ScrollText}
      />
      <DashboardCard
        title="รอดำเนินการ"
        value={orderSummary?.pendingOrders || 0}
        Icon={ClockArrowDown}
      />
      <DashboardCard
        title="รอยืนยัน"
        value={orderSummary?.awaitingConfirmationOrders || 0}
        Icon={LoaderCircle}
      />
      <DashboardCard
        title="ยืนยันแล้ว"
        value={orderSummary?.confirmedOrders || 0}
        Icon={CircleCheckBig}
      />
      <DashboardCard
        title="เตรียมจัดส่ง"
        value={orderSummary?.preparingToShipOrders || 0}
        Icon={Truck}
      />
      <DashboardCard
        title="ยกเลิกและคืนเงิน"
        value={orderSummary?.cancelledOrders || 0}
        Icon={CircleX}
      />
    </div>
  );
}
