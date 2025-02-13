"use client";

import { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  // AddressElement,
} from "@stripe/react-stripe-js";
import Loading from "@/components/shared/Loading";
import {
  // StripeAddressElementOptions,
  StripePaymentElementOptions,
} from "@stripe/stripe-js";

type Props = {
  handleSetPaymentSuccess: (value: boolean) => void;
};
export default function StripeCheckoutForm({ handleSetPaymentSuccess }: Props) {
  // stripe hook
  const stripe = useStripe();
  const elements = useElements();

  // local state
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      // const { error } = await stripe.confirmPayment({
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        // confirmParams: {
        //   // return_url: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL || "/",
        //   // payment_method_data: {
        //   //   billing_details: {
        //   //     email: "techpowerdevpro@gmail.com", // ใส่อีเมลหลอกๆไว้ เนื่องจาก stripe required
        //   //   },
        //   // },
        // },
      });

      console.log("result==>", result);

      if (!result.error) {
        // return router.push("/complete-checkout");

        // clear payment state
        handleSetPaymentSuccess(true);
        // clear cart
        // send order data to queue
        // create order
        // decrease product quantity
        // create payment record
        // setPaymentIntent(null);
        // setClientSecret(null);
        // setTotalAmount(0);
      }

      if (result.error) {
        if (
          result.error.type === "card_error" ||
          result.error.type === "validation_error"
        ) {
          setMessage(
            result.error.message || "จ่ายเงินไม่สำเร็จ กรุณาลองอีกครั้ง"
          );
        } else {
          setMessage("เกิดข้อผิดพลาดในการประมวลผล");
        }
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setMessage("พบข้อผิดพลาด กรุณาลองอีกครั้ง");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
    business: {
      name: "Red Ocean Marketing",
    },
    // fields: {
    //   billingDetails: {
    //     email: "never", // ไม่เก็บอีเมล
    //   },
    // },
  };

  // const StripeAddressElementOptions: StripeAddressElementOptions = {
  //   mode: "shipping",
  //   autocomplete: {
  //     mode: "automatic",
  //   },
  // };

  if (!stripe || !elements) {
    return (
      <div className="h-full w-full flex justify-center items-center">
        <Loading size={40} />
      </div>
    );
  }

  return (
    <form
      id="payment-form"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 my-4"
    >
      <h1 className="text-xl font-semibold">ช่องทางการชำระเงิน</h1>
      {/* <AddressElement options={StripeAddressElementOptions} /> */}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className={`w-full p-2 rounded-sm mb-5 text-white ${
          isLoading ? "bg-gray-300" : "bg-green-500"
        }`}
      >
        <span id="button-text">
          {isLoading ? "กำลังดำเนินการ..." : "ชำระตอนนี้"}
        </span>
      </button>
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
