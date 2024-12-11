import { OrderColumn } from "@/app/features/order/admin/OrderColumn";
import { DataTable } from "@/components/shared/table/DataTable";
import { getAllOrders } from "@/services/orderServices";

export default async function page() {
  const orders = await getAllOrders();
  console.log(orders);
  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            คำสั่งซื้อทั้งหมด
          </h2>
          {/* <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p> */}
        </div>
        <div className="flex items-center space-x-2">{/* <UserNav /> */}</div>
      </div>
      {orders && <DataTable data={orders} columns={OrderColumn} />}
    </div>
  );
}
