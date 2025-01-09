"use client";

import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { getOneOrder } from "@/services/orderServices";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { FetchOneOrderResponseType, OrderType } from "@/types/orderTypes";
import Container from "@/components/shared/Container";
import { useEffect, useState } from "react";
import Loading from "@/components/shared/Loading";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { Button } from "@/components/ui/button";

export default function OrderDetail({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const orders: FetchOneOrderResponseType = await getOneOrder(params.id);
      setOrder(orders.data);
    };
    fetchOrder();
  }, [params.id]);

  if (!order) {
    return <Loading />;
  }

  // ใช้คำนวณผลรวมของคำสั่งซื้อ
  const extraAmount = order?.orderItems?.reduce((total, item) => {
    return total + item.quantity * (item.discount || 0);
  }, 0);

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
            <span>{order?.trackingNumber || "ยังไม่มีข้อมูล"}</span>
          </p>
          <p className="flex flex-wrap gap-2">
            <span className="font-semibold">สถานะ:</span>
            <span>{order?.status || "ไม่มีข้อมูล"}</span>
          </p>
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
                            alt={item.name || "Product image"}
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
                      {formatPrice(item.discount || 0)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(item.unitPrice - (item.discount || 0))}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {/* {formatPrice(
                        item.unitPrice * item.quantity -
                          (item.discount || 0) * item.quantity
                      )} */}
                      {formatPrice(item.total)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-300 text-right font-bold">
                  <td colSpan={6} className="py-2 px-4">
                    รวมเป็นเงินทั้งหมด: {formatPrice(order?.totalAmount || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
            {order.status === "awaiting_confirmation" && (
              <div className="flex flex-col justify-between items-center gap-4 my-2">
                <div>
                  <span>
                    เนื่องจากมียอดรวมออเดอร์ไม่ถึงเป้าหมาย
                    หากต้องการสั่งซื้อท่านจะต้องชำระเงินเพิ่มอีก
                  </span>
                  <span className="text-green-500">
                    {` ${formatPrice(extraAmount || 0)} `}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-green-500 hover:bg-green-500 hover:bg-opacity-90">
                    ชำระเพิ่ม
                  </Button>
                  <Button>ยกเลิกและคืนเงิน</Button>
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
