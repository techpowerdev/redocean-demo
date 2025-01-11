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

import { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "@/app/features/checkout/forms/StripeCheckoutForm";
import CompletePage from "@/app/features/checkout/forms/CompletePage";
import { StripeCreatePaymentIntent } from "@/services/stripeServices";
import CheckoutForm from "@/app/features/checkout/forms/CheckoutForm";
import AddressSelector from "@/app/features/address/forms/AddressSelector";
import Container from "@/components/shared/Container";
import LineLogin from "@/app/features/auth/LineLogin";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";

// Load Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Page(): JSX.Element {
  // global state
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  // local state
  const [clientSecret, setClientSecret] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentIntent, setPaymentIntent] = useState(null);

  // Check if payment is confirmed
  // useEffect(() => {
  //   const paymentIntentClientSecret = new URLSearchParams(
  //     window.location.search
  //   ).get("payment_intent_client_secret");

  //   if (paymentIntentClientSecret) {
  //     setConfirmed(true);
  //   }
  // }, []);

  const createPaymentIntentData = {
    currency: "thb",
    captureLater: true,
    paymentState: "initial_payment",
    orderId: "order1",
    orderType: "groupbuying",
    orderItems: [
      {
        unitPrice: 100,
        discount: 10,
        quantity: 2,
      },
      {
        unitPrice: 20,
        discount: 1,
        quantity: 2,
      },
    ],
  };
  // Create PaymentIntent on component mount
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await StripeCreatePaymentIntent(
          createPaymentIntentData
        );
        console.log(data.paymentIntent);
        console.log(data.order);
        if (data.order) {
          setTotalAmount(data.order.totalAmount);
        }

        if (data.paymentIntent.client_secret) {
          setClientSecret(data.paymentIntent.client_secret);
        }
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    locale: "th",
    appearance: {
      theme: "stripe",
    },
  };

  if (!currentUser) {
    return <LineLogin />;
  }
  return (
    <Container>
      <div className="w-full h-full flex flex-col gap-4">
        <AddressSelector />
        {clientSecret && stripePromise && (
          <Elements options={options} stripe={stripePromise}>
            {confirmed ? (
              <CompletePage />
            ) : (
              <StripeCheckoutForm totalAmount={totalAmount} />
            )}
          </Elements>
        )}
      </div>
    </Container>
  );
}
