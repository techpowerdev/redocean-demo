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
import Image from "next/image";

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
              amount: summary
                ? summary.totalAmount - summary.discountTotal
                : order.totalAmount,
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
          <div className="my-4">
            <div className="grid grid-cols-[30%_1fr]">
              {activity.product?.image && (
                <div className="relative w-full aspect-square">
                  <Image
                    fill
                    src={`${
                      process.env.NEXT_PUBLIC_IMAGE_HOST_URL +
                      activity.product.image
                    }`}
                    alt={activity.product.id}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4 text-lg">
                <div className="my-4">
                  <h1 className="font-semibold"> สินค้า :</h1>
                  <p>รหัสสินค้า : {activity.product?.sku}</p>
                  <p>ชื่อสินค้า : {activity.product?.name}</p>
                  <p>รายละเอียด : {activity.product?.description}</p>
                </div>
                <div className="font-semibold">รายละเอียดโปรโมชั่น :</div>
                <div>
                  <span>{"ส่วนลด " + activity.discountAmount}</span>
                  <span>
                    {activity.discountType === "fixed" ? " บาท" : " %"}
                  </span>
                </div>
                {activity.discountGroupAmount &&
                  activity.discountGroupAmount > 0 && (
                    <div>
                      <span>
                        {"จำนวนส่วนลดสูงสุด " + activity.discountGroupAmount}
                      </span>
                      <span>
                        {activity.discountType === "fixed" ? " บาท" : " %"}
                      </span>
                    </div>
                  )}

                {activity.limitQuantity && activity.maxQuantity && (
                  <div>
                    {"สินค้ามีจำนวนจำกัดแค่ " +
                      activity.maxQuantity +
                      " ชิ้นเท่านั้น"}
                  </div>
                )}
                {activity.limitQuantityPerUser &&
                  activity?.maxQuantityPerUser && (
                    <div>
                      {"จำกัดจำนวนไม่เกิน " +
                        activity.maxQuantityPerUser +
                        " ชิ้นต่อคน"}
                    </div>
                  )}
              </div>
            </div>
          </div>
          {/* <PromotionProductCard PromotionActivity={activity} /> */}
        </div>
      ))}
    </div>
  );
}
