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

import { useState, useEffect, useCallback } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "@/app/features/checkout/forms/StripeCheckoutForm";
import AddressSelector from "@/app/features/address/forms/AddressSelector";
import Container from "@/components/shared/Container";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { useCheckoutStore } from "@/state-stores/useCheckoutStore";
import PaymentSuccess from "@/app/features/checkout/forms/PaymentSuccess";
import { StripeCreatePaymentIntentForOneProductType } from "@/types/stripeTypes";
import { StripeCreatePaymentIntentForOneProduct } from "@/services/stripeServices";

// Load Stripe with your publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function Page(): JSX.Element {
  // global state
  const cart = useCartServerStore((state) => state.cart);
  const setPaymentIntent = useCheckoutStore((state) => state.setPaymentIntent);
  const clientSecret = useCheckoutStore((state) => state.clientSecret);
  const setClientSecret = useCheckoutStore((state) => state.setClientSecret);
  const setTotalAmount = useCheckoutStore((state) => state.setTotalAmount);

  // const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const createPaymentIntent = async (
    createPaymentIntentData: StripeCreatePaymentIntentForOneProductType
  ) => {
    try {
      const { data } = await StripeCreatePaymentIntentForOneProduct(
        createPaymentIntentData
      );
      console.log(data.paymentIntent);
      setPaymentIntent(data);
      if (data.paymentIntent.amount) {
        const totalAmount = (data.paymentIntent.amount ?? 0) / 100;
        setTotalAmount(totalAmount);
      }
      // console.log(data.order);
      // if (data.order) {
      //   setTotalAmount(data.order.totalAmount);
      // }

      if (data.paymentIntent.client_secret) {
        setClientSecret(data.paymentIntent.client_secret);
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
    }
  };
  // Create PaymentIntent on component mount
  useEffect(() => {
    // if (cart?.cartItems) {
    //   // setLoading(true);
    //   // await createPaymentIntentForCartProducts(cart?.id);
    //   // setLoading(false);
    //   console.log("cart product", cart);
    // } else {
    createPaymentIntent(createPaymentIntentData);
    // }
  }, []);

  const options: StripeElementsOptions = {
    clientSecret: clientSecret ?? "",
    locale: "th",
    appearance: {
      theme: "stripe",
    },
  };

  const handleSetPaymentSuccess = useCallback((value: boolean) => {
    setPaymentSuccess(value);
  }, []);

  return (
    <div className="w-full h-full">
      <Container>
        {clientSecret && stripePromise && (
          <div className="w-full h-full flex flex-col gap-4">
            <AddressSelector />
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
