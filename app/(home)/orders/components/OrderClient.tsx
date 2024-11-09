"use client";

import React from "react";
import OrderItem from "./OrderItem";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { TicketX } from "lucide-react";
import { useOrderStore } from "@/state-stores/orderStore";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import Loading from "@/components/shared/Loading";
import LineLogin from "@/components/auth/LineLogin";

export default function OrderClient() {
  const orders = useOrderStore((state) => state.orders);
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  const loading = useCurrentUserStore((state) => state.loading);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-screen justify-center items-center">
        <Loading size={40} />
      </div>
    );
  }

  // if (!currentUser) {
  //   return <LineLogin />;
  // }

  if (!orders || orders.length === 0) {
    return (
      <div className="py-28 flex flex-col items-center">
        <TicketX size={40} />
        <div className="text-xl">ไม่พบข้อมูลการสั่งซื้อ</div>
        <div>
          <Link
            href={"/"}
            className="text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack />
            <span>เลือกดูสินค้า</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {orders &&
        orders.map((item, i) => {
          return <OrderItem key={item.id + i} item={item} />;
        })}
    </div>
  );
}
