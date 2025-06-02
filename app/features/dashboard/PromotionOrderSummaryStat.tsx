import React from "react";
import {
  CircleCheckBig,
  CircleX,
  ClockArrowDown,
  LoaderCircle,
  Package,
  ScrollText,
} from "lucide-react";
import { GetPromotionOrderSummaryResponse } from "@/types/orderTypes";
import StatCard from "@/app/features/dashboard/StatCard";

type Props = {
  summary: GetPromotionOrderSummaryResponse["data"]["summary"];
};

export default function PromotionOrderSummaryStat({ summary }: Props) {
  return (
    <div className="w-full grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="ทั้งหมด"
        value={summary?.totalOrders || 0}
        Icon={ScrollText}
      />
      <StatCard
        title="รอดำเนินการ"
        value={summary?.pendingOrders || 0}
        Icon={ClockArrowDown}
      />
      <StatCard
        title="รอยืนยัน"
        value={summary?.awaitingConfirmationOrders || 0}
        Icon={LoaderCircle}
      />
      <StatCard
        title="ยืนยันแล้ว"
        value={summary?.confirmedOrders || 0}
        Icon={CircleCheckBig}
      />
      <StatCard
        title="เตรียมจัดส่ง"
        value={summary?.preparingToShipOrders || 0}
        Icon={Package}
      />
      <StatCard
        title="ยกเลิกและคืนเงิน"
        value={summary?.cancelledAndRefundedOrders || 0}
        Icon={CircleX}
      />
    </div>
  );
}
