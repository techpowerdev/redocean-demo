"use client";

import { OrderColumn } from "@/app/features/order/admin/OrderColumn";
import Loading from "@/components/shared/Loading";
import { DataTable } from "@/components/shared/table/DataTable";
import { getAllOrders } from "@/services/orderServices";
import { useAdminOrderStore } from "@/state-stores/admin/adminOrderStore";
import { useEffect } from "react";

export default function Orders() {
  // global state
  const setOrders = useAdminOrderStore((state) => state.setOrders);
  const orders = useAdminOrderStore((state) => state.orders);

  useEffect(() => {
    const fetchOrders = async () => {
      const orders = await getAllOrders();
      setOrders(orders?.data);
    };
    fetchOrders();
  }, []);

  if (!orders) {
    <Loading />;
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            คำสั่งซื้อทั้งหมด
          </h2>
        </div>
      </div>
      {orders ? (
        <DataTable data={orders} columns={OrderColumn} />
      ) : (
        <div>ไม่พบข้อมูล</div>
      )}
    </div>
  );
}
