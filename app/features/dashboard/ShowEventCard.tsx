"use client";

import { PromotionType } from "@/types/fetchTypes";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { PromotionCountdown } from "@/app/features/promotion/PromotionCountdown";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  createOrderFullfillment,
  CreateOrderFullfillmentBody,
  getPromotionOrder,
} from "@/services/orderServices";
import { OrderType } from "@/types/orderTypes";
import Loading from "@/components/shared/Loading";
import OrderSummaryOfPromotionToday from "./OrderSummaryOfPromotionToday";
import { Separator } from "@/components/ui/separator";
import PromotionProductCard from "../promotion/PromotionProductCard";

interface Props {
  promotion: PromotionType;
}

export default function ShowEventCard({ promotion }: Props) {
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (promotionActivityId: string) => {
    setLoading(true);
    try {
      const result: OrderType[] = await getPromotionOrder(promotionActivityId);

      if (result) {
        const orders: CreateOrderFullfillmentBody[] = [];

        result.map((order) => {
          // คำนวณยอดรวม
          const summary = order.orderItems?.reduce(
            (acc, item) => {
              acc.discountTotal += item.discount * item.quantity;
              acc.specialDiscountTotal += item.specialDiscount * item.quantity;
              acc.totalAmount += item.unitPrice * item.quantity;
              return acc;
            },
            { discountTotal: 0, specialDiscountTotal: 0, totalAmount: 0 }
          );

          console.log("summary", summary);

          const orderBody: CreateOrderFullfillmentBody = {
            items:
              order.orderItems?.map((item) => ({
                code: item.sku || "", // ดึงค่า sku จาก item
                sell_price: item.unitPrice, // ดึงค่า sell_price จาก item
                quantity: item.quantity, // ดึงค่า quantity จาก item
              })) ?? [],
            shipping_address: {
              name: order.shippingAddress.recipient,
              tel: order.shippingAddress.phoneNumber,
              address: order.shippingAddress.address,
              sub_district: order.shippingAddress.subDistrict,
              district: order.shippingAddress.district,
              state_province: order.shippingAddress.province,
              country: {
                id: 219,
              },
              postcode: order.shippingAddress.postalCode,
            },
            shipping: {
              code: "S160-01",
              price: order.shippingFee || 0,
            },
            discount: {
              type: "fixed",
              value: summary?.discountTotal || 0,
              amount: summary?.discountTotal || 0,
            },
            order_reference: order.id,
            discount_total:
              summary?.discountTotal ||
              0 /*ส่วนลดทั้งหมดหมายเหตุ ตอนนี้มีค่าเท่ากับ discount.amount*/,
            total: summary?.totalAmount || order.totalAmount, //SUM(items.sell_price * items.quantity)
            net: summary
              ? summary.totalAmount - summary.discountTotal
              : order.totalAmount, //total + shipping.price - discount_total
            note: "Test",
            payment: {
              state: "paid",
              amount: 320,
            },
          };
          if (orderBody) {
            orders.push(orderBody);
          }
        });

        console.log("orders fullfilment : ", orders);

        const failedOrders: {
          order: CreateOrderFullfillmentBody;
          error: unknown;
        }[] = [];

        const results = await Promise.all(
          orders.map(async (order) => {
            try {
              return await createOrderFullfillment(order);
            } catch (error) {
              failedOrders.push({ order, error }); // เก็บรายการที่ล้มเหลว
              return null; // หรือค่าเริ่มต้นกรณีล้มเหลว
            }
          })
        );

        console.log("Failed Orders:", failedOrders);
        console.log("results Orders:", results);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 my-5">
      <div className="w-full flex gap-2 justify-between items-center">
        <div>
          <PromotionCountdown
            startTime={formatDateTimePromotion(promotion.startAt)}
            endTime={formatDateTimePromotion(promotion.endAt)}
          />
        </div>
      </div>
      <Separator className="my-4" />
      {promotion.promotionActivities?.map((activity) => (
        <div key={activity.id} className="w-full">
          <div className="flex gap-2 justify-end items-center mb-6">
            <h1>เป้าหมาย: {activity.minimumPurchaseQuantity}</h1>
            <Button>ยกเลิกและคืนเงิน</Button>
            <Button
              onClick={() => fetchOrders(activity.id)}
              className="bg-green-500 hover:bg-green-500 hover:bg-opacity-90"
            >
              {loading ? <Loading /> : "ส่งคำสั่งซื้อให้ไปรษณีย์"}
            </Button>
          </div>
          <OrderSummaryOfPromotionToday promotionActivityId={activity.id} />
          <PromotionProductCard PromotionActivity={activity} />
        </div>
      ))}
    </div>
  );
}
