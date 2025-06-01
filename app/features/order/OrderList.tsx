"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDateTimePromotion } from "@/utils/formatDate";
import NoOrder from "@/app/features/order/NoOrder";
import OrderItem from "@/app/features/order/OrderItem";
import { getUserOrders } from "@/services/orderServices";
import { Order } from "@/types/baseTypes";
import { Eye, FileClock, Truck } from "lucide-react";
import { formatPrice } from "@/utils/formatPrice";
import { statuses } from "@/app/features/order/data/OrderStatuses";
import Heading from "@/components/shared/Heading";

export default function OrderList() {
  const [userOrders, setUserOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        setUserOrders(userOrders.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrders();
  }, []);

  if (!userOrders || userOrders.length === 0) {
    return <NoOrder />;
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <Heading title="ประวัติการสั่งซื้อ" center />
      <FileClock size={30} className="text-gray-300" />
      <div className="flex flex-col gap-4 pb-4">
        {userOrders.map((order) => (
          <div key={order.id}>
            <div key={order.id} className="border shadow-sm rounded-md p-2">
              <div className="flex justify-between items-center">
                <span className="text-[14px]">
                  {formatDateTimePromotion(
                    new Date(order.createdAt).toISOString()
                  )}
                </span>
                <span className="text-[14px] font-bold text-green-600 border px-2 p-1 rounded-sm">
                  {statuses.find((status) => status.value === order.status)
                    ?.label || "อยู่ระหว่างดำเนินการ"}
                </span>
              </div>
              <Link href={`/order/${order.id}`}>
                {order.orderItems?.map((orderItem) => (
                  <OrderItem key={orderItem.id} item={orderItem} />
                ))}
                {order.orderVouchers?.[0]?.voucherGroup &&
                  (() => {
                    const voucherGroup = order.orderVouchers?.[0]?.voucherGroup;
                    if (!voucherGroup) return null;
                    return (
                      <div className="flex gap-2">
                        <span>บัตรกำนัล {voucherGroup.storeName}</span>
                        <span>มูลค่า {formatPrice(voucherGroup.amount)}</span>
                      </div>
                    );
                  })()}
              </Link>
              {order.couponDiscount > 0 && (
                <p className="text-[14px] text-end font-semibold text-red-500 my-2">
                  โค้ดส่วนลด :
                  <span className="ml-2">
                    -{formatPrice(order.couponDiscount)}
                  </span>
                </p>
              )}

              <p className="text-end font-semibold my-2">
                รวมเป็นเงินทั้งสิ้น : {formatPrice(order.netAmount)}
              </p>
              <div className="grid grid-cols-2 items-center gap-2">
                <Link
                  href={`/order/${order.id}`}
                  className="flex justify-center items-center gap-2 mt-2 bg-white p-2 rounded-md w-full text-primary hover:underline "
                >
                  <Eye size={20} />
                  ดูรายละเอียด
                </Link>
                {
                  order.trackingNumber !== null &&
                    order.trackingNumber !== "" && (
                      <Link
                        target="_blank"
                        href={`https://track.thailandpost.co.th/?trackNumber=${order.trackingNumber}`}
                        className="flex justify-center items-center gap-2 mt-2 bg-white p-2 rounded-md w-full text-primary hover:underline "
                      >
                        <Truck size={20} />
                        ติดตามพัสดุ
                      </Link>
                    )
                  // : (
                  //   <div className="flex justify-center items-center gap-2 mt-2 bg-white p-2 rounded-md w-full text-primary">
                  //     ยังไม่มีเลขพัสดุ
                  //   </div>
                  // )
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
