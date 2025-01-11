"use client";

import CompletePage from "@/app/features/checkout/forms/CompletePage";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";

// Load Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function page() {
  const [clientSecret, setClientSecret] = useState<string>("");

  useEffect(() => {
    const paymentIntentClientSecret = new URLSearchParams(
      window.location.search
    ).get("payment_intent_client_secret");
    if (paymentIntentClientSecret) {
      console.log(paymentIntentClientSecret);
      setClientSecret(paymentIntentClientSecret);
    }
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <div>
      {clientSecret && stripePromise && (
        <Elements options={options} stripe={stripePromise}>
          <CompletePage />
        </Elements>
      )}
    </div>
  );
}
