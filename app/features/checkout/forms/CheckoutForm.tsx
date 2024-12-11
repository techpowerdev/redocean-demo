"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import AddressSelector from "../../address/forms/AddressSelector";
import Container from "@/components/shared/Container";
import { useAddressStore } from "@/state-stores/addressStore";
import { CreateOderItemType } from "@/types/orderTypes";
import { createOrder } from "@/services/orderServices";

const checkoutSchema = z.object({
  paymentMethod: z.enum(["creditCard", "qrcode"]),
  cardNumber: z
    .string()
    .min(16, "เลขบัตรเครดิต ต้องมี 16 ตัว")
    .max(16, "เลขบัตรเครดิต ต้องมี 16 ตัว")
    .optional(),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "รูปแบบวันหมดอายุไม่ถูกต้อง")
    .optional(),
  securityCode: z
    .string()
    .min(3, "เลขหลังบัตร ต้องมี 3 ตัว")
    .max(3, "เลขหลังบัตร ต้องมี 3 ตัว")
    .optional(),
  billingSameAsShipping: z.boolean().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
  // global state
  const token = useCurrentUserStore((state) => state.token);
  const cart = useCartServerStore((state) => state.cart);
  const clearCart = useCartServerStore((state) => state.clearCart);
  const selectedAddress = useAddressStore((state) => state.selectedAddress);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "creditCard" | "qrcode"
  >("qrcode");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "qrcode", // ตั้งค่าเริ่มต้นให้เป็น qrcode
    },
  });

  const placeOrder = async () => {
    setIsLoading(true);
    try {
      const orderItemsData: CreateOderItemType[] = []; // เริ่มต้นเป็น array เปล่า

      if (cart) {
        cart.cartItems.forEach((item) => {
          const orderItem = {
            sku: item.sku,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            specialDiscount: item.specialDiscount || 0,
            productId: item.productId,
            promotionActivityId: item.promotionActivityId || null,
            total: item.discount
              ? item.quantity * item.unitPrice - item.discount * item.quantity
              : item.quantity * item.unitPrice,
          };
          orderItemsData.push(orderItem); // เพิ่ม orderDetail เข้าไปใน orderDetails
        });

        const createOrderData = {
          orderType: "groupbuying", // กำหนดค่าให้ตรงกับชนิดข้อมูลที่ต้องการจริง ๆ
          creditCardFee: 0, // กำหนดค่าเริ่มต้น หรือกำหนดค่าจากข้อมูลจริง
          shippingFee: 0,
          totalAmount: cart.cartTotalAmount,
          returnAmount: 0,
          // status: "completed",
          // trackingNumber: "TH0988767373",
          shippingAddress: {
            recipient: selectedAddress?.recipient,
            phoneNumber: selectedAddress?.phoneNumber,
            address: selectedAddress?.address,
            street: selectedAddress?.street,
            subDistrict: selectedAddress?.subDistrict,
            district: selectedAddress?.district,
            province: selectedAddress?.province,
            postalCode: selectedAddress?.postalCode,
          },
          orderItems: orderItemsData,
        };

        await createOrder(token || "", createOrderData);

        toast.success("ชำระเงินสำเร็จ");
        router.push("/orders");
        clearCart(token || ""); // test order
      }
    } catch (error) {
      console.error("Error creating order data:", error); // เพิ่มการจัดการข้อผิดพลาด
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = () => {
    placeOrder();
  };

  return (
    <Container>
      <h1 className="text-2xl font-semibold mb-4">ดำเนินการชำระเงิน</h1>
      {/* Address */}
      <div className="mb-4">
        <AddressSelector />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-lg font-semibold mt-6">ช่องทางการชำระเงิน</h2>
        <div className="mb-4">
          <div className="flex space-x-4">
            {/* Credit Card */}
            <label
              className={`cursor-pointer p-4 border-2 rounded-md flex-1 text-center ${
                selectedPaymentMethod === "creditCard"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedPaymentMethod("creditCard")}
            >
              <input
                type="radio"
                value="creditCard"
                {...register("paymentMethod", { required: true })}
                className="hidden" // ซ่อน input[type="radio"]
              />
              <p className="font-medium">บัตรเครดิต</p>
              {/* <div className="flex justify-center mt-2 space-x-2">
                  <img src="/visa-icon.png" alt="Visa" className="w-3 h-3" />
                  <img
                    src="/mastercard-icon.png"
                    alt="MasterCard"
                    className="w-3 h-3"
                  />
                </div> */}
            </label>

            {/* QR Code */}
            <label
              className={`cursor-pointer p-4 border-2 rounded-md flex-1 text-center ${
                selectedPaymentMethod === "qrcode"
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedPaymentMethod("qrcode")}
            >
              <input
                type="radio"
                value="qrcode"
                {...register("paymentMethod", { required: true })}
                className="hidden" // ซ่อน input[type="radio"]
              />
              <p className="font-medium">QR Code</p>
              {/* <div className="flex justify-center mt-2 space-x-2">
                  <img
                    src="/promptpay-icon.png"
                    alt="PromptPay"
                    className="w-6 h-6"
                  />
                </div> */}
            </label>
          </div>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm">
              {errors.paymentMethod?.message}
            </p>
          )}
        </div>

        {/* Payment Method */}

        {/* Conditional Payment Form */}
        {selectedPaymentMethod === "creditCard" && (
          <>
            {/* Card Number */}
            <div className="mb-4">
              <label htmlFor="cardNumber" className="block text-sm font-medium">
                เลขบัตรเครดิต
              </label>
              <input
                {...register("cardNumber")}
                id="cardNumber"
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-sm">
                  {errors.cardNumber?.message}
                </p>
              )}
            </div>

            {/* Expiration Date */}
            <div className="mb-4">
              <label
                htmlFor="expirationDate"
                className="block text-sm font-medium"
              >
                วันหมดอายุ
              </label>
              <input
                {...register("expirationDate")}
                id="expirationDate"
                type="text"
                placeholder="MM/YY"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.expirationDate && (
                <p className="text-red-500 text-sm">
                  {errors.expirationDate?.message}
                </p>
              )}
            </div>

            {/* Security Code */}
            <div className="mb-4">
              <label
                htmlFor="securityCode"
                className="block text-sm font-medium"
              >
                เลขหลังบัตร
              </label>
              <input
                {...register("securityCode")}
                id="securityCode"
                type="text"
                className="w-full p-2 border border-gray-300 rounded mt-1"
              />
              {errors.securityCode && (
                <p className="text-red-500 text-sm">
                  {errors.securityCode?.message}
                </p>
              )}
            </div>

            {/* Billing same as shipping */}
            <div className="mb-4 flex items-center">
              <input
                {...register("billingSameAsShipping")}
                id="billingSameAsShipping"
                type="checkbox"
                className="mr-2"
              />
              <label htmlFor="billingSameAsShipping" className="text-sm">
                ข้อมูลการเรียกเก็บเงินจะเหมือนกับข้อมูลการจัดส่ง
              </label>
            </div>
          </>
        )}

        {selectedPaymentMethod === "qrcode" && (
          <div className="mb-4">
            <label className="block text-sm font-medium">
              สแกน QR code ผ่านแอพธนาคาร
            </label>
            <div className="border border-gray-300 p-4 flex items-center justify-center">
              {/* ใส่รูป QR Code ของคุณที่นี่ */}
              <img src="/qrcode.png" alt="QR Code" className="w-32 h-32" />
            </div>
          </div>
        )}

        {/* Total */}
        <div className="text-center text-xl font-semibold text-slate-700 py-4">
          ยอดที่ต้องชำระ {formatPrice(cart?.cartTotalAmount || 0)}
        </div>

        {/* Submit button */}
        <Button
          size={"lg"}
          type="submit"
          disabled={isLoading}
          className="w-full text-lg"
          onClick={() => {}}
        >
          {isLoading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
        </Button>
      </form>
    </Container>
  );
}
