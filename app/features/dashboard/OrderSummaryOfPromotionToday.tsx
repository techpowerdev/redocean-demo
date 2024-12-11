import React, { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import { getOrderSummaryOfGroupBuying } from "@/services/orderServices";
import { CircleCheckBig, RefreshCw, ScrollText, Truck } from "lucide-react";

type orderSummaryType = {
  totalOrders: number;
  pendingOrders: number;
  shippingOrders: number;
  completedOrders: number;
};

type Props = {
  promotionActivityId: string | null;
};

export default function OrderSummaryOfPromotionToday({
  promotionActivityId,
}: Props) {
  const [orderSummary, setOrderSummary] = useState<orderSummaryType | null>(
    null
  );
  useEffect(() => {
    const fetchData = async () => {
      const orderSummary: orderSummaryType | null =
        await getOrderSummaryOfGroupBuying(promotionActivityId);
      console.log(orderSummary);
      setOrderSummary(orderSummary);
    };
    fetchData();
  }, [promotionActivityId]);
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total Orders"
        value={orderSummary?.totalOrders || 0}
        Icon={ScrollText}
      />
      <DashboardCard
        title="Pending"
        value={orderSummary?.pendingOrders || 0}
        Icon={RefreshCw}
      />
      <DashboardCard
        title="Shipping"
        value={orderSummary?.shippingOrders || 0}
        Icon={Truck}
      />
      <DashboardCard
        title="Completed"
        value={orderSummary?.completedOrders || 0}
        Icon={CircleCheckBig}
      />
    </div>
  );
}
