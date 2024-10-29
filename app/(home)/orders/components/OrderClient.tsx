"use client";

import { useCart } from "@/hooks/useCart";
import React from "react";
import OrderItem from "./OrderItem";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import { TicketX } from "lucide-react";

export default function OrderClient() {
  const { orderProducts } = useCart();

  if (!orderProducts || orderProducts.length === 0) {
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
    <div>
      {orderProducts &&
        orderProducts.map((item) => {
          return <OrderItem key={item.id} item={item} />;
        })}
      {/* <Button onClick={test}>test api</Button> */}
    </div>
  );
}
