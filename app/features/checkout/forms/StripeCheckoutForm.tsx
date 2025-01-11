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
import { formatPrice } from "@/utils/formatPrice";

type Props = {
  totalAmount: number;
};

export default function StripeCheckoutForm({ totalAmount }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          // return_url: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL || "/",
          payment_method_data: {
            billing_details: {
              email: "techpowerdevpro@gmail.com", // ใส่อีเมลหลอกๆไว้ เนื่องจาก stripe required
            },
          },
        },
      });

      if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Payment failed. Please try again.");
        } else {
          setMessage("An unexpected error occurred.");
        }
      }
    } catch (err) {
      console.error("Payment confirmation error:", err);
      setMessage("An error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "tabs",
    business: {
      name: "Red Ocean Marketing",
    },
    fields: {
      billingDetails: {
        email: "never", // ไม่เก็บอีเมล
      },
    },
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
    <form id="payment-form" onSubmit={handleSubmit}>
      <h1 className="text-2xl font-semibold mb-4">ช่องทางการชำระเงิน</h1>
      {/* <AddressElement options={StripeAddressElementOptions} /> */}
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <div className="text-center text-xl font-semibold text-slate-700 py-4">
        ยอดที่ต้องชำระ {formatPrice(totalAmount || 0)}
      </div>
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
