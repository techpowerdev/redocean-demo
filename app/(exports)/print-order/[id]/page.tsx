"use client";

// import "./printStyle.module.css";
import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import {
  changeTrackingNumber,
  getOneOrder,
  getOrderVouchersOfUser,
} from "@/services/orderServices";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { Order, OrderVoucher } from "@/types/baseTypes";
import PrintButton from "@/components/shared/PrintButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Loading from "@/components/shared/Loading";
import ResponsiveImage from "@/components/shared/ResponsiveImage";
import { statuses } from "@/app/features/order/data/OrderStatuses";
import GiftVoucherCard from "@/app/features/voucher/GiftVoucherCard";
import Container from "@/components/shared/Container";

const FormSchema = z.object({
  trackingNumber: z.string(),
});

export default function PrintOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  // local state
  const [order, setOrder] = useState<Order | null>(null);
  const [orderVouchers, setOrderVouchers] = useState<OrderVoucher[]>([]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      trackingNumber: "",
    },
  });

  const getVoucherCard = async () => {
    if (!order || !order.orderVouchers?.[0]?.voucherGroup?.id) return;
    try {
      const result = await getOrderVouchersOfUser({
        orderId: order.id,
        voucherGroupId: order.orderVouchers[0].voucherGroup.id,
      });
      if (result.data.orderVouchers) {
        setOrderVouchers(result.data.orderVouchers);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await changeTrackingNumber(params.id, data.trackingNumber);
      toast.success("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      toast.error("บันทึกข้อมูลไม่สำเร็จ");
    }
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const result = await getOneOrder(params.id);
        setOrder(result.data);
        form.reset({ trackingNumber: result.data.trackingNumber || "" });
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [form, params.id]);

  useEffect(() => {
    if (!order) return;

    const fetchVoucher = async () => {
      try {
        await getVoucherCard();
      } catch (err) {
        console.error("Failed to fetch voucher:", err);
      }
    };

    fetchVoucher();
  }, [order]);

  if (!order) {
    return <Loading />;
  }

  return (
    <Container>
      <div className="bg-white text-black">
        <h1 className="text-xl md:text-2xl font-bold my-4 text-center">
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
            <span className="font-semibold">สถานะ:</span>
            <span>
              {statuses.find((status) => status.value === order.status)
                ?.label || "อยู่ระหว่างดำเนินการ"}
            </span>
          </p>
          <div className="no-print flex items-center justify-start gap-2">
            <div className="font-semibold">เลขติดตามพัสดุ: </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-2"
              >
                <FormField
                  control={form.control}
                  name="trackingNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="กรอกเลข tracking number"
                          {...field}
                          className="w-fit min-w-80 "
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">บันทึก</Button>
              </form>
            </Form>
          </div>

          {/* print button */}
          <div className="flex justify-end items-center">
            <PrintButton />
          </div>
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
                                ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${item.image}`
                                : "/no-image.jpg"
                            }
                            alt={item.productName ?? "Product image"}
                          />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {truncateText(30, item.productName)}
                          </p>
                          {item.modelName && (
                            <p className="text-sm text-gray-600">
                              {item.modelName}
                            </p>
                          )}
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
                {order.orderVouchers?.length ? (
                  <tr className="border-b">
                    <td className="border border-gray-300 px-2 py-2 md:px-4">
                      <div className="flex items-center gap-2 md:gap-4">
                        <div>
                          <p className="font-semibold">
                            {truncateText(
                              30,
                              `บัตรกำนัล ${order.orderVouchers?.[0].voucherGroup?.storeName}`
                            )}
                          </p>
                          <p className="text-sm text-gray-600">
                            มูลค่า
                            {formatPrice(
                              order.orderVouchers?.[0].voucherGroup?.amount || 0
                            )}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(
                        order.orderVouchers?.[0].voucherGroup?.amount || 0
                      )}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(0)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(
                        (order.orderVouchers?.[0].voucherGroup?.amount || 0) - 0
                      )}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-center">
                      {order.orderVouchers.length}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 md:px-4 text-right">
                      {formatPrice(
                        (order.orderVouchers?.[0].voucherGroup?.amount || 0) *
                          order.orderVouchers.length
                      )}
                    </td>
                  </tr>
                ) : null}
                <tr className="bg-gray-300 text-right font-bold">
                  <td colSpan={6} className="py-2 px-4">
                    {order.couponDiscount > 0 && (
                      <p className="text-[14px] text-end font-semibold text-red-500 my-2">
                        โค้ดส่วนลด :
                        <span className="ml-2">
                          -{formatPrice(order.couponDiscount)}
                        </span>
                      </p>
                    )}
                    รวมเป็นเงินทั้งหมด: {formatPrice(order?.netAmount || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {orderVouchers.length ? (
          <div className="no-print my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {orderVouchers.map((orderVoucher) => (
              <div key={orderVoucher.id}>
                <GiftVoucherCard
                  storeName={orderVoucher.voucherGroup?.storeName || ""}
                  value={orderVoucher.voucherGroup?.amount ?? 0}
                  expiryDate={orderVoucher.voucherGroup?.expiresAt || ""}
                  serialNumber={orderVoucher?.voucher?.code}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Container>
  );
}
