"use client";

// import "./printStyle.module.css";
import Image from "next/image";
import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { changeTrackingNumber, getOneOrder } from "@/services/orderServices";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { FetchOneOrderResponseType, OrderType } from "@/types/orderTypes";
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

const FormSchema = z.object({
  trackingNumber: z.string(),
});

export default function PrintOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  // local state
  const [order, setOrder] = useState<OrderType | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      trackingNumber: "",
    },
  });

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
        const result: FetchOneOrderResponseType = await getOneOrder(params.id);
        setOrder(result.data);
        form.reset({ trackingNumber: result.data.trackingNumber || "" });
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };
    fetchOrder();
  }, [form, params.id]);

  if (!order) {
    return <Loading />;
  }

  return (
    <div className="p-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">
        รายละเอียดคำสั่งซื้อ
      </h1>
      <p className="flex gap-2 justify-start items-end mb-2">
        <span className="font-semibold">หมายเลขคำสั่งซื้อ: </span>
        <span>{order?.id}</span>
      </p>
      <div className="no-print flex items-center justify-start gap-2">
        <div className="font-semibold">เลขติดตามพัสดุ: </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
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

      {/* Order Information */}
      <div className="mb-6">
        <span className="font-semibold">วันที่: </span>
        {/* {formatDateTimePromotion(order?.createdAt.toString() || "")} */}
        {formatDateTimePromotion(order?.createdAt.toString())}
        {/* <p>สถานะ: {order?.status}</p> */}
      </div>

      {/* Customer Information */}
      <div className="mb-6">
        <h2 className="font-semibold">ลูกค้า:</h2>
        <p>ชื่อ: {order?.shippingAddress?.recipient}</p>
        <p>เบอร์โทร: {order?.shippingAddress?.phoneNumber}</p>
        <h2 className="font-semibold mt-4">ที่อยู่ในการจัดส่ง:</h2>
        <p className="flex gap-2">
          <span>{order?.shippingAddress?.address}</span>
          <span>{order?.shippingAddress?.street}</span>
          <span>{order?.shippingAddress?.subDistrict}</span>
          <span>{order?.shippingAddress?.district}</span>
          <span>{order?.shippingAddress?.province}</span>
          <span>{order?.shippingAddress?.postalCode}</span>
        </p>
      </div>

      {/* Order Items Table */}
      <div>
        <h2 className="text-xl font-bold mb-4 print:bg-gray-300">
          รายการสินค้า
        </h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="border border-gray-300 px-4 py-2 text-left">
                สินค้า
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                ราคา
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                ส่วนลด
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                ราคาสุทธิ
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                จำนวน
              </th>
              <th className="border border-gray-300 px-4 py-2 text-right">
                รวมเป็นเงิน
              </th>
            </tr>
          </thead>
          <tbody>
            {order?.orderItems?.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16">
                      <Image
                        src={
                          item?.image
                            ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${item.image}`
                            : "/no-image.jpg"
                        }
                        alt={item.name || "Product image"}
                        fill
                        className="object-cover"
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
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {formatPrice(item.unitPrice)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {formatPrice(item.discount || 0)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {formatPrice(item.unitPrice - (item.discount || 0))}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {/* {formatPrice(item.total)} */}
                  {formatPrice(
                    item.unitPrice * item.quantity -
                      (item.discount || 0) * item.quantity
                  )}
                </td>
              </tr>
            ))}
            <tr
              style={{ backgroundColor: "green" }}
              className="text-end border-b bg-green-600"
            >
              <td colSpan={6} className="font-bold bg-gray-300 py-2 px-4">
                <span className="mr-2">รวมเป็นเงินทั้งหมด</span>
                {order?.totalAmount ? formatPrice(order.totalAmount) : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
