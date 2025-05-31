"use client";

import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "@/app/features/checkout/forms/StripeCheckoutForm";
import Container from "@/components/shared/Container";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type Props = {
  params: { clientSecret: string };
};

export default function CheckoutPage({ params }: Props) {
  const { clientSecret } = params;

  const options: StripeElementsOptions = {
    clientSecret: clientSecret ?? "",
    locale: "th",
    appearance: {
      theme: "stripe",
    },
    loader: "auto",
  };

  return (
    <div className="w-full h-full">
      <Container>
        {clientSecret && stripePromise && (
          <div className="w-full h-full flex flex-col gap-4">
            <Elements options={options} stripe={stripePromise}>
              <StripeCheckoutForm />
            </Elements>
          </div>
        )}
      </Container>
    </div>
  );
}
