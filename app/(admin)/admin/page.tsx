import { CircleCheckBig, RefreshCw, ScrollText, Truck } from "lucide-react";
import DashboardCard from "../../features/dashboard/DashboardCard";
import ShowEventCard from "../../features/dashboard/ShowEventCard";
import { getPromotionToday } from "@/services/promotionServices";
import { getOrderSummaryOfGroupBuying } from "@/services/orderServices";
import NoPromotion from "@/app/features/promotion/NoPromotion";
import OrderSearch from "../../features/dashboard/OrderSearch";

type orderSummaryType = {
  totalOrders: number;
  pendingOrders: number;
  shippingOrders: number;
  completedOrders: number;
};
export default async function dashboard() {
  const promotions = await getPromotionToday();
  const orderSummary: orderSummaryType | null =
    await getOrderSummaryOfGroupBuying();

  if (!promotions?.data || promotions.data.length === 0) {
    return <NoPromotion />;
  }

  return (
    <div className="flex-grow p-6 md:overflow-y-auto md:px-12 md:py-6">
      <h1 className={`mb-4 text-xl md:text-2xl`}>กิจกรรมวันนี้</h1>
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
      {promotions.data?.map((promotion) => (
        <div key={promotion.id}>
          <ShowEventCard promotion={promotion} />
        </div>
      ))}
      {/* <OrderSearch /> */}
    </div>
  );
}
