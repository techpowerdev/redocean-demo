"use client";

import { useState, useCallback } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "@/app/features/checkout/forms/StripeCheckoutForm";
import Container from "@/components/shared/Container";
import PaymentSuccess from "@/app/features/checkout/forms/PaymentSuccess";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type Props = {
  params: { clientSecret: string };
};

export default function CheckoutPage({ params }: Props) {
  // local state
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  // const [payAmount, setPayAmount] = useState(0);

  const { clientSecret } = params;

  const options: StripeElementsOptions = {
    clientSecret: clientSecret ?? "",
    locale: "th",
    appearance: {
      theme: "stripe",
    },
    loader: "auto",
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  // useEffect(() => {
  //   const amount = new URLSearchParams(window.location.search).get("amount");
  //   const totalAmount = Number(amount) / 100;
  //   setPayAmount(totalAmount);
  // }, []);

  return (
    <div className="w-full h-full">
      {paymentSuccess ? (
        <PaymentSuccess />
      ) : (
        <Container>
          {/* <h1 className="text-xl font-semibold">
            ยอดที่ต้องชำระ : {formatPrice(payAmount)}
          </h1> */}

          {clientSecret && stripePromise && (
            <div className="w-full h-full flex flex-col gap-4">
              <Elements options={options} stripe={stripePromise}>
                <StripeCheckoutForm
                  handleSetPaymentSuccess={handleSetPaymentSuccess}
                />
              </Elements>
            </div>
          )}
        </Container>
      )}
    </div>
  );
}
