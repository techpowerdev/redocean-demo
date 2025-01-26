// "use client";

// import { useState, useEffect } from "react";
// import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import StripeCheckoutForm from "@/app/features/checkout/forms/StripeCheckoutForm";
// import CompletePage from "@/app/features/checkout/forms/CompletePage";
// import { StripeCreatePaymentIntent } from "@/services/stripeServices";

// // Load Stripe with your publishable key
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
// );

// export default function Page(): JSX.Element {
//   const [clientSecret, setClientSecret] = useState<string>("");
//   const [confirmed, setConfirmed] = useState<boolean>(false);

//   // Check if payment is confirmed
//   useEffect(() => {
//     const paymentIntentClientSecret = new URLSearchParams(
//       window.location.search
//     ).get("payment_intent_client_secret");

//     if (paymentIntentClientSecret) {
//       setConfirmed(true);
//     }
//   }, []);

//   const createPaymentIntentData = {
//     currency: "thb",
//     captureLater: true,
//     paymentState: "initial_payment",
//     orderId: "order1",
//     orderType: "groupbuying",
//     orderItems: [
//       {
//         unitPrice: 100,
//         discount: 10,
//         quantity: 2,
//       },
//       {
//         unitPrice: 20,
//         discount: 1,
//         quantity: 2,
//       },
//     ],
//   };
//   // Create PaymentIntent on component mount
//   useEffect(() => {
//     const createPaymentIntent = async () => {
//       try {
//         const { data } = await StripeCreatePaymentIntent(
//           createPaymentIntentData
//         );

//         if (data.paymentIntent.client_secret) {
//           setClientSecret(data.paymentIntent.client_secret);
//         }
//       } catch (error) {
//         console.error("Error creating payment intent:", error);
//       }
//     };

//     createPaymentIntent();
//   }, []);

//   const options: StripeElementsOptions = {
//     clientSecret,
//     locale: "th",
//     appearance: {
//       theme: "stripe",
//     },
//   };

//   return (
//     <div className="w-full h-full">
//       {clientSecret && stripePromise && (
//         <Elements options={options} stripe={stripePromise}>
//           {confirmed ? <CompletePage /> : <StripeCheckoutForm />}
//         </Elements>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useCallback, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "@/app/features/checkout/forms/StripeCheckoutForm";
import Container from "@/components/shared/Container";
// import { useCheckoutStore } from "@/state-stores/useCheckoutStore";
import PaymentSuccess from "@/app/features/checkout/forms/PaymentSuccess";
import { useCheckoutStore } from "@/state-stores/useCheckoutStore";
import { formatPrice } from "@/utils/formatPrice";

// Load Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

type Props = {
  params: { clientSecret: string };
};

export default function CheckoutPage({ params }: Props) {
  // global state
  const paymentIntent = useCheckoutStore((state) => state.paymentIntent);

  // local state
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payAmount, setPayAmount] = useState(0);

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

  useEffect(() => {
    const amount = new URLSearchParams(window.location.search).get("amount");
    const totalAmount = Number(amount) / 100;
    setPayAmount(totalAmount);
  }, []);

  return (
    <div className="w-full h-full">
      {paymentSuccess ? (
        <PaymentSuccess clientSecret={clientSecret} />
      ) : (
        <Container>
          <h1 className="text-xl font-semibold">
            ยอดที่ต้องชำระ : {formatPrice(payAmount)}
          </h1>

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
