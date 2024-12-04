// import "./printStyle.module.css";
import Image from "next/image";
import { formatPrice } from "@/utils/formatPrice";
import { truncateText } from "@/utils/truncateText";
import { getOneOrder } from "@/services/orderServices";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { OrderType } from "@/types/orderTypes";
import PrintButton from "@/components/shared/PrintButton";

export default async function PrintOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const data: OrderType = await getOneOrder(params.id);

  return (
    <div className="p-8 bg-white text-black">
      <h1 className="text-2xl font-bold mb-4 text-center">
        รายละเอียดคำสั่งซื้อ
      </h1>
      <p className="flex gap-2 justify-start items-end mb-2">
        <span className="font-semibold">หมายเลขคำสั่งซื้อ: </span>
        <span>{data?.id}</span>
      </p>
      <p className="no-print">
        <span className="font-semibold">เลขติดตามพัสดุ: </span>{" "}
        {data?.trackingNumber || "ไม่มีข้อมูล"}
      </p>

      {/* print button */}
      <div className="flex justify-end items-center">
        <PrintButton />
      </div>

      {/* Order Information */}
      <div className="mb-6">
        <span className="font-semibold">วันที่: </span>
        {formatDateTimePromotion(data?.createdAt)}
        {/* <p>สถานะ: {data?.status}</p> */}
      </div>

      {/* Customer Information */}
      <div className="mb-6">
        <h2 className="font-semibold">ลูกค้า:</h2>
        <p>ชื่อ: {data?.shippingAddress?.recipient}</p>
        <p>เบอร์โทร: {data?.shippingAddress?.phoneNumber}</p>
        <h2 className="font-semibold mt-4">ที่อยู่ในการจัดส่ง:</h2>
        <p className="flex gap-2">
          <span>{data?.shippingAddress?.address}</span>
          <span>{data?.shippingAddress?.street}</span>
          <span>{data?.shippingAddress?.subDistrict}</span>
          <span>{data?.shippingAddress?.district}</span>
          <span>{data?.shippingAddress?.province}</span>
          <span>{data?.shippingAddress?.postalCode}</span>
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
            {data.orderItems?.map((item) => (
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
                  {formatPrice(item.discount)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {formatPrice(item.unitPrice - item.discount)}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-right">
                  {/* {formatPrice(item.total)} */}
                  {formatPrice(
                    item.unitPrice * item.quantity -
                      item.discount * item.quantity
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
                {data?.totalAmount ? formatPrice(data.totalAmount) : ""}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
