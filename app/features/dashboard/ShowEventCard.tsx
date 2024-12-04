"use client";

import { formatPrice } from "@/utils/formatPrice";
import { PromotionType } from "@/types/fetchTypes";
import PromotionProductImage from "@/app/features/promotion/PromotionProductImage";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { PromotionCountdown } from "@/app/features/promotion/PromotionCountdown";
import {
  calculateDiscountedPrice,
  DiscountType,
} from "@/utils/calculateDiscountedPrice";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  createOrderFullfillment,
  CreateOrderFullfillmentBody,
  FulfillmentOrderItem,
  processOrders,
  searchOrders,
} from "@/services/orderServices";
import { OrderType } from "@/types/orderTypes";
import Loading from "@/components/shared/Loading";

interface Props {
  promotion: PromotionType;
}

export default function ShowEventCard({ promotion }: Props) {
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const filters = {
        status: "pending",
        orderType: promotion.type,
        startDate: promotion.startAt,
        endDate: promotion.endAt,
      };
      const result: OrderType[] = await searchOrders(filters);
      if (result) {
        console.log("fetch order : ", result);

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
        // (async () => {
        //   const { results, failedOrders } = await processOrders(
        //     orders,
        //     createOrderFullfillment
        //   );

        //   console.log("Results:", results);
        //   console.log("Failed Orders:", failedOrders);
        // })();

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

  // ดึงตัวเลือกทั้งหมดจาก variantOptions
  const optionsMap: Record<string, Set<string>> = {};

  promotion.promotionActivities?.[0]?.product.productVariants?.forEach(
    (variant) => {
      Object.entries(variant.variantOptions).forEach(([key, value]) => {
        if (!optionsMap[key]) optionsMap[key] = new Set();
        optionsMap[key].add(value as string);
      });
    }
  );

  // แปลง Set เป็น Array สำหรับการแสดงผล
  const options = Object.entries(optionsMap).map(([key, values]) => ({
    key,
    values: Array.from(values),
  }));

  return (
    <div className="flex flex-col items-start gap-2 my-5">
      <div className="w-full flex gap-2 justify-between items-center">
        <div>
          <PromotionCountdown
            startTime={formatDateTimePromotion(promotion.startAt)}
            endTime={formatDateTimePromotion(promotion.endAt)}
          />
        </div>
        <div className="flex gap-2 justify-center items-center">
          <h1>
            เป้าหมาย:{" "}
            {promotion.promotionActivities?.[0].minimumPurchaseQuantity}
          </h1>
          <Button>ยกเลิกและคืนเงิน</Button>
          <Button
            onClick={fetchOrders}
            className="bg-green-500 hover:bg-green-500 hover:bg-opacity-90"
          >
            {loading ? <Loading /> : "ส่งคำสั่งซื้อให้ไปรษณีย์"}
          </Button>
        </div>
      </div>
      {promotion.promotionActivities?.map((activity) => (
        <div
          key={promotion.id}
          className="grid grid-cols-1 md:grid-cols-2 my-5"
        >
          <PromotionProductImage
            images={
              (
                activity.product.productVariants
                  ?.filter((variant) => variant.image !== null)
                  .map((variant) => variant.image) || []
              ).length > 0
                ? activity.product.productVariants
                    ?.filter((variant) => variant.image !== null)
                    .map((variant) => variant.image)
                : activity.product?.image
                ? [activity.product.image]
                : []
            }
          />
          <div className="flex flex-col gap-y-4 w-full p-2 md:p-8">
            <h1 className="text-xl">{activity.product.name}</h1>
            {/* Display Price and Stock */}
            <>
              <p className="text-xl font-bold mb-2 line-through">
                {formatPrice(activity.product.price)}
              </p>
              <div className="flex flex-col">
                <h1>เหลือเพียง</h1>
                {activity.discountAmount && (
                  <span className="text-lg text-green-500">
                    {formatPrice(
                      calculateDiscountedPrice(
                        activity.product.price,
                        activity.discountAmount,
                        activity.discountType as DiscountType
                      ).discountedPrice
                    )}
                  </span>
                )}
                {activity.discountGroupAmount &&
                activity.discountGroupAmount > 0 ? (
                  <>
                    <span className="p-2 text-xl">หรือ</span>
                    <div className="flex gap-1 items-center">
                      <div className="text-2xl text-red-600 font-bold">
                        {formatPrice(
                          calculateDiscountedPrice(
                            activity.product.price,
                            activity.discountGroupAmount,
                            activity.discountType as DiscountType
                          ).discountedPrice
                        )}
                      </div>
                      <div>{`(เมื่อมียอดสั่งซื้อครบ ${activity.minimumPurchaseQuantity} ชิ้น)`}</div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
            {/* ตัวเลือก */}
            {activity.product.hasVariant &&
              options.map((option) => (
                <div key={option.key}>
                  <h2>{option.key}</h2>
                  <div className="flex gap-2 flex-wrap">
                    {option.values.map((value) => (
                      <button
                        className="px-4 py-2 cursor-default border rounded-md text-gray-800 bg-white"
                        key={value}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            <div>
              <label className="block font-semibold mb-1">รายละเอียด:</label>{" "}
              {activity.product.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
