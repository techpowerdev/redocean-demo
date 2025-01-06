"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import Loading from "@/components/shared/Loading";
import { formatDateTimePromotion } from "@/utils/formatDate";
import NoOrder from "./NoOrder";
import OrderItem from "./OrderItem";
import { getUserOrders } from "@/services/orderServices";
import { useRouter } from "next/navigation";
import { FetchAllOrderResponseType, OrderType } from "@/types/orderTypes";
import { Eye, Truck } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";

export default function OrderList() {
  const router = useRouter();

  const [userOrders, setUserOrders] = useState<OrderType[] | null>(null);
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders: FetchAllOrderResponseType = await getUserOrders();
        setUserOrders(userOrders.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, [currentUser, router]);

  if (!userOrders) {
    return <Loading size={40} />;
  }

  return userOrders && userOrders.length > 0 ? (
    userOrders.map((order) => (
      <div key={order.id}>
        <div
          key={order.id}
          className="border shadow-sm rounded-md px-2 pt-2 pb-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-[14px]">
              {formatDateTimePromotion(new Date(order.createdAt).toISOString())}
            </span>
            <span className="text-[14px] font-bold text-green-600 border px-2 p-1 rounded-sm">
              {order.status}
            </span>
          </div>
          <Link href={`/order/${order.id}`}>
            {order.orderItems?.map((orderItem) => (
              <OrderItem key={orderItem.id} item={orderItem} />
            ))}
          </Link>
          <p className="text-end font-semibold my-2">
            รวมเป็นเงินทั้งสิ้น : {formatPrice(order.totalAmount)}
          </p>
          <div className="grid grid-cols-2 items-center gap-2">
            <Link
              href={`/order/${order.id}`}
              className="flex justify-center items-center gap-2 mt-2 bg-white p-2 rounded-md w-full text-primary hover:underline "
            >
              <Eye size={20} />
              ดูรายละเอียด
            </Link>
            {order.trackingNumber !== null && order.trackingNumber !== "" ? (
              <Link
                target="_blank"
                href={`https://track.thailandpost.co.th/?trackNumber=${order.trackingNumber}`}
                className="flex justify-center items-center gap-2 mt-2 bg-white p-2 rounded-md w-full text-primary hover:underline "
              >
                <Truck size={20} />
                ติดตามพัสดุ
              </Link>
            ) : (
              <div className="flex justify-center items-center gap-2 mt-2 bg-white p-2 rounded-md w-full text-primary">
                อยู่ระหว่างดำเนินการ
              </div>
            )}
          </div>
        </div>
      </div>
    ))
  ) : (
    <NoOrder />
  );
}
