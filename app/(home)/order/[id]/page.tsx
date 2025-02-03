"use client";

import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { cancelOrderAndRefund, getOneOrder } from "@/services/orderServices";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { FetchOneOrderResponseType, OrderType } from "@/types/orderTypes";
import Container from "@/components/shared/Container";
import { useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { Button } from "@/components/ui/button";
import {
  createPaymentIntent,
  getPaymentIntentById,
} from "@/services/stripeServices";
import { useRouter } from "next/navigation";
import { statuses } from "@/app/features/order/data/OrderStatuses";

export default function OrderDetail({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchOrder = async () => {
      const order: FetchOneOrderResponseType = await getOneOrder(params.id);
      setOrder(order.data);
    };
    fetchOrder();
  }, [params.id]);

  useEffect(() => {
    if (!order) return;

    const orderTimestamp = new Date(order?.createdAt).getTime(); // แปลงเวลาที่รับมาเป็น timestamp
    const expiryTimestamp = orderTimestamp + 15 * 60 * 1000; // บวก 15 นาที

    const updateTimer = () => {
      const currentTime = new Date().getTime();
      const remainingTime = expiryTimestamp - currentTime;

      if (remainingTime <= 0) {
        setTimeLeft(null); // หมดเวลาแล้ว
      } else {
        setTimeLeft(Math.floor(remainingTime / 1000));
      }
    };

    updateTimer(); // อัปเดตทันที
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [order?.createdAt]);

  // แปลงวินาทีเป็น mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  if (!order) {
    return <Loading />;
  }

  const checkout = async () => {
    const paymentIntent = order.payments?.find(
      (payment) => payment.paymentState === "initial_payment"
    );

    if (paymentIntent) {
      const paymentIntentData = await getPaymentIntentById(
        paymentIntent.stripePaymentId
      );
      if (paymentIntentData.data.client_secret) {
        router.push(`/checkout/${paymentIntentData.data.client_secret}`);
      }
    }
  };

  const createExtraPaymentIntent = async () => {
    if (!order) {
      return;
    }

    try {
      setLoading(true);
      const { data } = await createPaymentIntent({
        orderId: order.id,
        amount: order.totalDiscount,
        paymentState: "additional_payment",
      });

      if (data.clientSecret) {
        router.push(`/checkout/${data.clientSecret}`);
      }
    } catch (error) {
      console.log("error create paymentIntent ==", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!order) {
      return;
    }

    try {
      setCanceling(true);
      const { data } = await cancelOrderAndRefund(order.id);

      if (data) {
        router.push(`/orders`);
      }
    } catch (error) {
      console.log("Error canceling order ==", error);
    } finally {
      setCanceling(false);
    }
  };

  return (
    <Container>
      {/* <MobileContainer> */}
      <div className="p-2 md:p-8 bg-white text-black">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">
          รายละเอียดคำสั่งซื้อ
        </h1>

        {/* Order Information */}
        <div className="mb-4 space-y-2">
          <p className="flex flex-wrap gap-2 items-end">
            <span className="font-semibold">หมายเลขคำสั่งซื้อ:</span>
            <span>{order?.id}</span>
          </p>
          <p>
            <span className="font-semibold">วันที่:</span>{" "}
            {formatDateTimePromotion(order?.createdAt.toString())}
          </p>
          <p className="flex flex-wrap gap-2">
            <span className="font-semibold">เลขติดตามพัสดุ:</span>
            <span>{order?.trackingNumber ?? "ยังไม่มีข้อมูล"}</span>
          </p>
          <p className="flex flex-wrap gap-2">
            <span className="font-semibold">สถานะ:</span>
            <span>
              {statuses.find((status) => status.value === order.status)
                ?.label || "อยู่ระหว่างดำเนินการ"}
            </span>
          </p>
          {order.cancelReason && (
            <p className="flex flex-wrap gap-2">
              <span className="font-semibold">เหตผล:</span>
              <span>{order.cancelReason}</span>
            </p>
          )}
        </div>
        {/* Order Items Table */}
        <div>
          <h2 className="text-lg md:text-xl font-bold mb-4">รายการสินค้า</h2>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-300">
                  <th className="border border-gray-300 px-2 py-2 md:px-4 text-left">
                    สินค้า
                  </th>
                  <th className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                    ราคา
                  </th>
                  <th className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                    ส่วนลด
                  </th>
                  <th className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                    ราคาสุทธิ
                  </th>
                  <th className="border border-gray-300 px-2 py-2 md:px-4 text-center">
                    จำนวน
                  </th>
                  <th className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                    รวมเป็นเงิน
                  </th>
                </tr>
              </thead>
              <tbody>
                {order?.orderItems?.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="border border-gray-300 px-2 py-2 md:px-4">
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="relative w-12 h-auto md:w-16 md:h-auto">
                          <ResponsiveImage
                            src={
                              item?.image
                                ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${item.image}`
                                : "/no-image.jpg"
                            }
                            alt={item.name ?? "Product image"}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {truncateText(30, item.name)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.variantOptions}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(item.unitPrice)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(item.discount ?? 0)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(item.unitPrice - (item.discount ?? 0))}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(
                        (item.unitPrice - item.discount) * item.quantity
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-300 text-right font-bold">
                  <td colSpan={6} className="py-2 px-4">
                    รวมเป็นเงินทั้งหมด: {formatPrice(order?.netAmount || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
            {order.status === "need_to_pay" && (
              <div className="w-full my-4 flex flex-col items-center gap-2">
                {timeLeft !== null ? (
                  <p className="text-lg font-semibold text-red-500">
                    ชำระภายใน : {formatTime(timeLeft)}
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-red-500">
                    หมดเวลาชำระเงินแล้ว
                  </p>
                )}
                <Button
                  size={"lg"}
                  onClick={checkout}
                  disabled={loading || timeLeft === null}
                  className="text-lg bg-green-500 hover:bg-green-500 hover:bg-opacity-90"
                >
                  {loading ? "กำลังทำรายการ..." : "ดำเนินการชำระเงิน"}
                </Button>
              </div>
            )}
            {order.status === "awaiting_confirmation" && (
              <div className="flex flex-col justify-between items-center gap-4 my-2">
                <div>
                  <span>
                    เนื่องจากมียอดรวมออเดอร์ไม่ถึงเป้าหมาย
                    หากต้องการสั่งซื้อท่านจะต้องชำระเงินเพิ่มอีก
                  </span>
                  <span className="text-green-500">
                    {` ${formatPrice(order.totalDiscount ?? 0)} `}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={createExtraPaymentIntent}
                    disabled={loading}
                    className="bg-green-500 hover:bg-green-500 hover:bg-opacity-90"
                  >
                    {loading ? "กำลังทำรายการ..." : "ชำระเพิ่ม"}
                  </Button>
                  <Button
                    onClick={cancelOrder}
                    disabled={canceling}
                    className="bg-red-500 hover:bg-red-500 hover:bg-opacity-90"
                  >
                    {canceling ? "กำลังทำรายการ..." : "ยกเลิกและขอคืนเงิน"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* </MobileContainer> */}
    </Container>
  );
}
