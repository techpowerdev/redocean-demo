"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import Loading from "@/components/shared/Loading";
import { formatDateTimePromotion } from "@/utils/formatDate";
import NoOrder from "./NoOrder";
import OrderItem from "./OrderItem";
import { getUserOrders } from "@/services/orderServices";
import useAuthStore from "@/state-stores/useAuthStore";
import { useRouter } from "next/navigation";
import { OrderType } from "@/types/orderTypes";
import { Eye, Truck } from "lucide-react";

export default function OrderList() {
  const router = useRouter();

  const [userOrders, setUserOrders] = useState<OrderType[] | null>(null);
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const token = useCurrentUserStore((state) => state.token);
  const isTokenValid = useAuthStore((state) => state.isTokenValid);

  const checkToken = () => {
    if (token) {
      if (!isTokenValid(token)) {
        console.warn("Token expired or not available. Redirecting to login...");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      checkToken();
      try {
        const userOrders: OrderType[] = await getUserOrders(token || "");
        console.log("userOrders", userOrders);
        setUserOrders(userOrders);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, [currentUser]);

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
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/order/${order.id}`}
              className="flex justify-center items-center gap-2 mt-2 bg-white p-2 rounded-md w-full text-primary hover:underline "
            >
              <Eye size={20} />
              ดูรายละเอียด
            </Link>
            <Link
              target="_blank"
              href={`https://track.thailandpost.co.th/?trackNumber=${order.trackingNumber}`}
              className="flex justify-center items-center gap-2 mt-2 bg-white p-2 rounded-md w-full text-primary hover:underline "
            >
              <Truck size={20} />
              ติดตามพัสดุ
            </Link>
          </div>
        </div>
      </div>
    ))
  ) : (
    <NoOrder />
  );
}
