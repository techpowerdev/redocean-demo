"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CartProductType } from "@/types/product";
import { useCart } from "@/hooks/useCart";

const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(1, "กรุณากรอกชื่อ-สกุล")
    .regex(
      /^[ก-๏a-zA-Z\s]+$/,
      "ชื่อ-สกุล ต้องเป็นตัวอักษรไทยหรืออังกฤษเท่านั้น"
    ),
  // country: z.string().min(1, "กรุณาระบุประเทศ"),
  address: z.string().min(1, "กรุณากรอกที่อยู่ในการจัดส่ง"),
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

const CheckoutForm = () => {
  const { handleClearCart } = useCart(); // test order

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

  const onSubmit = (data: CheckoutFormData) => {
    setIsLoading(true);
    console.log("Form Data:", data);
    // test add to order
    const cartItems: any = localStorage.getItem("ShopCartItems");
    const cProduct: CartProductType[] | null = JSON.parse(cartItems);
    localStorage.setItem("ShopOrderItems", JSON.stringify(cProduct));
    handleClearCart(); // test order
    // Simulate a delay for API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success("ชำระเงินสำเร็จ");
      router.push("/orders");
    }, 2000);
  };

  return (
    <div className="max-w-[375px] mx-auto p-2">
      <div className="max-w-lg mx-auto p-6 border shadow-md rounded-lg bg-white">
        <h1 className="text-2xl font-semibold mb-4">ดำเนินการชำระเงิน</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium">
              ชื่อ-นามสกุล
            </label>
            <input
              {...register("fullName")}
              id="fullName"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          {/* Country */}
          {/* <div className="mb-4">
          <label htmlFor="country" className="block text-sm font-medium">
            Country or region
          </label>
          <select
            {...register("country")}
            id="country"
            className="w-full p-2 border border-gray-300 rounded mt-1"
          >
            <option value="Thailand">Thailand</option>
            <option value="US">US</option>
          </select>
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country.message}</p>
          )}
        </div> */}

          {/* Address */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium">
              ที่อยู่ในการจัดส่ง
            </label>
            <textarea
              rows={2}
              {...register("address")}
              id="address"
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">{errors.address.message}</p>
            )}
          </div>

          {/* Payment Method */}
          {/* Payment Method */}
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
                <label
                  htmlFor="cardNumber"
                  className="block text-sm font-medium"
                >
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
            ยอดที่ต้องชำระ ฿40.00
          </div>

          {/* Submit button */}
          <Button
            size={"lg"}
            type="submit"
            disabled={isLoading}
            className="w-full text-lg"
          >
            {isLoading ? "กำลังดำเนินการ..." : "ชำระเงิน"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutForm;
