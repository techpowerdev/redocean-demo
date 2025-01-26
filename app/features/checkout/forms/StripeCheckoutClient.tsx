"use client";

import { useState, useCallback } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "@/app/features/checkout/forms/StripeCheckoutForm";
import Container from "@/components/shared/Container";
import PaymentSuccess from "@/app/features/checkout/forms/PaymentSuccess";

// Load Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type Props = {
  clientSecret: string;
};
export default function StripeCheckoutClient({ clientSecret }: Props) {
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  return (
    <div className="w-full h-full">
      <Container>
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
      {paymentSuccess && <PaymentSuccess />}
    </div>
  );
}
