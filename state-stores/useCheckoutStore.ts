import { StripeCreatePaymentIntentResultType } from "@/types/stripeTypes";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type State = {
  paymentIntent: StripeCreatePaymentIntentResultType | null;
  clientSecret: string | null;
  totalAmount: number;
  confirmed: boolean;
};

export type Action = {
  setPaymentIntent: (
    paymentIntent: StripeCreatePaymentIntentResultType | null
  ) => void;
  setClientSecret: (secret: string | null) => void;
  setTotalAmount: (total: number) => void;
  setConfirmed: (isConfirm: boolean) => void;
};

export const useCheckoutStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        paymentIntent: null,
        clientSecret: null,
        totalAmount: 0,
        confirmed: false,
        setPaymentIntent: (paymentIntent) =>
          set({ paymentIntent: paymentIntent }),
        setClientSecret: (clientSecret) => set({ clientSecret: clientSecret }),
        setTotalAmount: (totalAmount) => set({ totalAmount: totalAmount }),
        setConfirmed: (isConfirm) => set({ confirmed: isConfirm }),
      }),
      { name: "khumkha-checkout" }
    )
  )
);
