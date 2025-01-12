"use client";

import { Button } from "@/components/ui/button";
import { StripeCreatePaymentIntentForOneProduct } from "@/services/stripeServices";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { useCheckoutStore } from "@/state-stores/useCheckoutStore";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import { AddProductToCardInputType } from "@/types/cartTypes";
import { StripeCreatePaymentIntentForOneProductType } from "@/types/stripeTypes";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  isActive?: boolean;
  product: AddProductToCardInputType;
  stock: number;
};

export default function BuyNowButton({ isActive, product, stock }: Props) {
  // global state
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  // checkout store
  const setPaymentIntent = useCheckoutStore((state) => state.setPaymentIntent);
  const setClientSecret = useCheckoutStore((state) => state.setClientSecret);
  const setTotalAmount = useCheckoutStore((state) => state.setTotalAmount);

  // other
  const router = useRouter();

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

  const handleAddToCart = async () => {
    if (!currentUser) {
      router.push("/login-line"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเชื่อมต่อไลน์");
      return;
    }
    if (!currentUser.phoneVerified) {
      router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      return;
    }
    try {
      await createPaymentIntent(createPaymentIntentData);
      router.push("/checkout");
    } catch (error) {
      console.log(error);
    }
  };

  const isOutOfStock = stock <= 0; // `true` when no stock is available

  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <Button
        size={"lg"}
        className="w-full lg:w-1/2 bg-primary text-lg"
        disabled={!isActive || isOutOfStock}
        onClick={handleAddToCart}
      >
        สั่งซื้อสินค้า
      </Button>
      {isOutOfStock ? (
        <span className="text-red-500 font-semibold">สินค้าหมด</span>
      ) : (
        <span className="text-red-500 font-semibold">
          เหลืออีก {stock} ชิ้น
        </span>
      )}
    </div>
  );
}
