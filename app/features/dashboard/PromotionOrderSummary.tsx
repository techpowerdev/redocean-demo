"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  changeOrderStatus,
  createOrderFullfillment,
  CreateOrderFullfillmentBody,
  getOneOrder,
  getPromotionOrderSummary,
} from "@/services/orderServices";

import { PromotionActivity } from "@/types/baseTypes";
import {
  createProductItem,
  createSummaryItem,
  sendFlexMessageToLine,
} from "@/services/pushMessageService";
import { ConfirmationPopup } from "@/components/shared/ConfirmationPopup";
import {
  FlexBox,
  FlexMessage,
  SendFlexMessageToLineParams,
} from "@/types/lineTypes";
import { formatPrice } from "@/utils/formatPrice";
import { GetPromotionOrderSummaryResponse } from "@/types/orderTypes";
import PromotionOrderSummaryStat from "./PromotionOrderSummaryStat";
import Image from "next/image";

interface Props {
  promotionActivity: PromotionActivity;
}

export default function PromotionOrderSummary({ promotionActivity }: Props) {
  const [sending, setSending] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  const [promotionOrderSummary, setPromotionOrderSummary] = useState<
    GetPromotionOrderSummaryResponse["data"] | null
  >(null);

  const [openSendOrderToConfirmForm, setOpenSendOrderToConfirmForm] =
    useState(false);
  const handleOpenSendOrderToConfirmForm = () => {
    setOpenSendOrderToConfirmForm(!openSendOrderToConfirmForm);
  };

  const [openConfirmOrderForm, setOpenConfirmOrderForm] = useState(false);
  const handleOpenConfirmOrderForm = () => {
    setOpenConfirmOrderForm(!openConfirmOrderForm);
  };

  const [openSendOrderToFulfillment, setOpenSendOrderToFulfillment] =
    useState(false);
  const handleOpenSendOrderToFulfillment = () => {
    setOpenSendOrderToFulfillment(!openSendOrderToFulfillment);
  };

  const needToConfirm = promotionOrderSummary?.orders?.filter(
    (order) => order.status === "pending"
  );

  const confirmedOrders = promotionOrderSummary?.orders?.filter(
    (order) => order.status === "confirmed"
  );

  console.log("orders===", promotionOrderSummary?.orders);
  console.log("needToConfirm===", needToConfirm);
  console.log("confirmedOrders===", confirmedOrders);

  const sendOrdersToConfirm = async () => {
    setSending(true);
    try {
      if (needToConfirm?.length) {
        const results = await Promise.all(
          needToConfirm.map(async (order) => {
            try {
              const fetchOrder = await getOneOrder(order.id);

              const orderData = fetchOrder?.data;
              const OrderItem: FlexBox[] =
                orderData.orderItems?.map((item) =>
                  createProductItem(
                    `${item.productName + " " + item.modelName}`,
                    formatPrice(item.unitPrice),
                    item.quantity.toString()
                  )
                ) ?? [];

              const flexMessage: FlexMessage = {
                type: "bubble",
                body: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    {
                      type: "image",
                      // url: `${process.env.NEXT_PUBLIC_CLIENT_HOST_URL}/logo.jpg`,
                      url: "https://demo.khumkha.com/_next/image?url=%2Flogo.jpg&w=3840&q=75",
                    },
                    {
                      type: "text",
                      text: "khumkha.com",
                      weight: "bold",
                      color: "#dc2626",
                      size: "sm",
                      align: "center",
                    },
                    {
                      type: "text",
                      text: "โปรดยืนยันคำสั่งซื้อ",
                      weight: "bold",
                      size: "lg",
                      color: "#ff8633",
                      align: "center",
                    },
                    {
                      type: "text",
                      text: "เนื่องจากยอดรวมออเดอร์ไม่ได้ตามเงื่อนไข โปรดยืนยันคำสั่งซื้อ หรือยกเลิกคำสั่งซื้อนี้",
                      size: "xs",
                      color: "#aaaaaa",
                      wrap: true,
                    },
                    { type: "separator", margin: "xxl" },

                    // 🔹 กล่องรายการสินค้า
                    {
                      type: "box",
                      layout: "vertical",
                      margin: "xxl",
                      spacing: "sm",
                      contents: [
                        // ✅ รายการสินค้า
                        // createProductItem("Energy Drink", "฿120", "x 1"),
                        ...OrderItem,
                        { type: "separator", margin: "xxl" },

                        // ✅ จำนวนสินค้า
                        createSummaryItem(
                          "รวมค่าสินค้า",
                          formatPrice(order.totalAmount)
                        ),
                        createSummaryItem(
                          "รวมส่วนลด",
                          formatPrice(order.totalDiscount)
                        ),
                        createSummaryItem(
                          "ยอดเงินสุทธิ",
                          formatPrice(order.netAmount)
                        ),
                        {
                          type: "button",
                          action: {
                            type: "uri",
                            label: "ไปที่หน้ายืนยันคำสั่งซื้อ",
                            uri: `${process.env.NEXT_PUBLIC_LINE_LIFF_URL}/order/${order.id}`,
                          },
                          style: "primary",
                          color: "#dc2626",
                          margin: "xl",
                        },
                      ],
                    },
                  ],
                },
                footer: {
                  type: "box",
                  layout: "vertical",
                  contents: [
                    // {
                    //   type: "button",
                    //   action: {
                    //     type: "uri",
                    //     label: "ไปที่หน้าการสั่งซื้อ",
                    //     uri: `${process.env.NEXT_PUBLIC_CLIENT_HOST_URL}/order/${order.id}`,
                    //   },
                    //   style: "primary",
                    //   color: "#dc2626",
                    // },
                    createSummaryItem("Order ID", order.id),
                  ],
                },
                styles: { footer: { separator: true } },
              };

              const message: SendFlexMessageToLineParams = {
                lineUid: orderData.user?.lineUid || "",
                flexMessage: flexMessage,
              };

              await sendFlexMessageToLine(message);

              // หากส่งข้อความสำเร็จ ให้เปลี่ยนสถานะออเดอร์
              // if (messageResult) {
              await changeOrderStatus(order.id, "awaiting_confirmation");
              // }

              // return messageResult;
            } catch (error) {
              console.error(
                `Failed to send message for order ${order.id}:`,
                error
              );
              // return null; // หรือค่าเริ่มต้นกรณีล้มเหลว
            }
          })
        );

        console.log("send line results:", results);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const updateAllOrdersStatusToConfirmed = async () => {
    setUpdating(true);
    try {
      if (needToConfirm?.length) {
        const results = await Promise.all(
          needToConfirm.map(async (order) => {
            try {
              // หากส่งข้อความสำเร็จ ให้เปลี่ยนสถานะออเดอร์
              const updatedResults = await changeOrderStatus(
                order.id,
                "confirmed"
              );
              return updatedResults;
            } catch (error) {
              console.error(
                `Failed to update status for order ${order.id}:`,
                error
              );
              return null; // หรือค่าเริ่มต้นกรณีล้มเหลว
            }
          })
        );

        console.log("updated status results:", results);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const sendOrdersToFulfillment = async () => {
    setLoading(true);
    try {
      if (confirmedOrders?.length) {
        const orders: CreateOrderFullfillmentBody[] = [];

        confirmedOrders.map((order) => {
          // คำนวณยอดรวม
          const summary = order.orderItems?.reduce(
            (acc, item) => {
              acc.discountTotal += (item.discount || 0) * item.quantity;
              acc.totalAmount += item.unitPrice * item.quantity;
              return acc;
            },
            { discountTotal: 0, totalAmount: 0 }
          );

          console.log("summary", summary);

          const orderBody: CreateOrderFullfillmentBody = {
            items:
              order.orderItems?.map((item) => ({
                code: item.productModel?.sku || "", // ดึงค่า sku จาก item
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
              const sendResult = await createOrderFullfillment(order);
              // หากส่งข้อความสำเร็จ ให้เปลี่ยนสถานะออเดอร์
              if (sendResult) {
                await changeOrderStatus(
                  order.order_reference,
                  "preparing_to_ship"
                );
                // capture การชำระเงินผ่านบัตรเครดิตที่ hold ไว้ หลังยืนยันออเดอร์แล้ว
                // await captureOrder(order.order_reference);
              }
              return sendResult;
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

  useEffect(() => {
    const fetchPromotionOrders = async () => {
      try {
        const promotionOrdersSummary = await getPromotionOrderSummary(
          promotionActivity.id
        );

        if (promotionOrdersSummary.data) {
          setPromotionOrderSummary(promotionOrdersSummary.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPromotionOrders();
  }, [promotionActivity.id]);

  if (!promotionActivity) return <div>ไม่พบกิจกรรมนี้</div>;

  return (
    <div className="flex flex-col items-start gap-2 my-5">
      <div className="my-4 w-full">
        <div className="w-full grid grid-cols-[30%_1fr] justify-start">
          <div className="w-full flex items-center justify-center">
            {promotionActivity.productItem?.images?.length && (
              <div className="relative w-full aspect-square">
                <Image
                  fill
                  src={
                    `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${promotionActivity.productItem?.images?.[0]}` ||
                    "/placeholder.svg"
                  }
                  alt={promotionActivity.productItem.id}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col items-start justify-center p-4 text-lg">
            <div className="my-4">
              <h1 className="font-semibold"> สินค้า :</h1>
              <p>รหัสสินค้า : {promotionActivity.productItem?.sku}</p>
              <p>ชื่อสินค้า : {promotionActivity.productItem?.name}</p>
              <p>รายละเอียด : {promotionActivity.productItem?.description}</p>
            </div>
          </div>
        </div>
        <div className="my-4">
          <div className="font-semibold">รายละเอียดโปรโมชั่น :</div>
          <div>
            <span>{"ส่วนลด " + promotionActivity.discountAmount}</span>
            <span>
              {promotionActivity.discountType === "fixed" ? " บาท" : " %"}
            </span>
          </div>
          {promotionActivity.limitQuantity && promotionActivity.maxQuantity && (
            <div>
              {"สินค้ามีจำนวนจำกัดแค่ " +
                promotionActivity.maxQuantity +
                " ชิ้นเท่านั้น"}
            </div>
          )}
          {promotionActivity.limitQuantityPerUser &&
            promotionActivity?.maxQuantityPerUser && (
              <div>
                {"จำกัดจำนวนไม่เกิน " +
                  promotionActivity.maxQuantityPerUser +
                  " ชิ้นต่อคน"}
              </div>
            )}
        </div>
      </div>
      {promotionActivity.minimumPurchaseQuantity &&
      promotionActivity.minimumPurchaseQuantity > 0 ? (
        <div className="flex gap-2 justify-end items-center my-6">
          <h1>เป้าหมาย: {promotionActivity.minimumPurchaseQuantity}</h1>
          <Button
            onClick={handleOpenSendOrderToConfirmForm}
            className="bg-red-500 hover:bg-red-500 hover:bg-opacity-90"
          >
            {sending ? "กำลังส่ง..." : "ส่งคำขอยืนยันคำสั่งซื้อ"}
          </Button>
          <ConfirmationPopup
            title="ส่งคำขอยืนยันคำสั่งซื้อ?"
            open={openSendOrderToConfirmForm}
            setOpen={handleOpenSendOrderToConfirmForm}
            action={() => sendOrdersToConfirm()}
          />
          <Button
            onClick={handleOpenConfirmOrderForm}
            className="bg-orange-500 hover:bg-orange-500 hover:bg-opacity-90"
          >
            {updating ? "กำลังอัปเดต..." : "ยืนยันคำสั่งซื้อทั้งหมด"}
          </Button>
          <ConfirmationPopup
            title="ต้องการยืนยันคำสั่งซื้อทั้งหมด?"
            open={openConfirmOrderForm}
            setOpen={handleOpenConfirmOrderForm}
            action={() => updateAllOrdersStatusToConfirmed()}
          />
          <Button
            onClick={handleOpenSendOrderToFulfillment}
            className="bg-green-500 hover:bg-green-500 hover:bg-opacity-90"
          >
            {loading ? "กำลังส่ง..." : "ส่งคำสั่งซื้อให้ไปรษณีย์"}
          </Button>
          <ConfirmationPopup
            title="ส่งคำสั่งซื้อให้ไปรษณีย์?"
            open={openSendOrderToFulfillment}
            setOpen={handleOpenSendOrderToFulfillment}
            action={() => sendOrdersToFulfillment()}
          />
        </div>
      ) : null}
      {promotionOrderSummary && (
        <PromotionOrderSummaryStat summary={promotionOrderSummary?.summary} />
      )}
    </div>
  );
}
