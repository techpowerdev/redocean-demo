"use client";

import { useAddressStore } from "@/state-stores/addressStore";
import React, { useState } from "react";
import AddressSelector from "@/app/features/address/forms/AddressSelector";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

import toast from "react-hot-toast";
import { StripeCreatePaymentIntent } from "@/services/stripeServices";
import {
  StripeCreatePaymentIntentProductItemType,
  StripeCreatePaymentIntentType,
} from "@/types/stripeTypes";
import { useRouter } from "next/navigation";
import { checkProductAvailabilityForUser } from "@/services/productServices";
import {
  CheckProductAvailabilityForUserPayloadType,
  CheckProductAvailabilityForUserResponseType,
} from "@/types/productTypes";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import OrderSummary from "./OrderSummary";

type Props = {
  singleItem?: StripeCreatePaymentIntentProductItemType;
  cartItems?: StripeCreatePaymentIntentProductItemType[];
};

export default function PlaceOrderCheckout({ singleItem, cartItems }: Props) {
  console.log("singleItem==", singleItem);
  console.log("cartItems==", cartItems);
  // global state
  const selectedAddress = useAddressStore((state) => state.selectedAddress);
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  // local state
  const [summaryProducts, setSummaryProducts] =
    useState<CheckProductAvailabilityForUserResponseType | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะของ Sheet

  // navigation
  const router = useRouter();

  const items = singleItem ? [singleItem] : cartItems || [];

  const handleCheckout = async () => {
    if (!currentUser) {
      router.push("/login-line"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเชื่อมต่อไลน์");
      return;
    }

    if (!currentUser.phoneVerified) {
      router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      return;
    }

    if (items.length === 0) {
      return;
    }

    setIsOpen(true);

    try {
      if (selectedAddress) {
        // กำหนดฟิลด์ที่ต้องการเก็บไว้
        const {
          recipient,
          phoneNumber,
          address,
          street,
          subDistrict,
          district,
          province,
          postalCode,
        } = selectedAddress;

        // สร้างข้อมูลใหม่ที่มีเฉพาะฟิลด์ที่ต้องการ
        const shippingAddress = {
          recipient,
          phoneNumber,
          address,
          street,
          subDistrict,
          district,
          province,
          postalCode,
        };

        const createPaymentData: StripeCreatePaymentIntentType = {
          items: items,
          shippingAddress,
          captureLater: true,
        };

        const { data } = await StripeCreatePaymentIntent(createPaymentData);

        if (data) {
          console.log("data===", data);

          const availableItems = data.items.filter(
            (item) =>
              item.warningMessage === null && item.isAvailableStock !== false
          );

          const unAvailableItems = data.items.filter(
            (item) =>
              item.warningMessage !== null && item.isAvailableStock !== false
          );

          const notAvailableStock = data.items.filter(
            (item) => item.isAvailableStock === false
          );

          console.log("availableItems", availableItems);
          console.log("unAvailableItems", unAvailableItems);
          console.log("notAvailableStock", notAvailableStock);

          const newSorted = [
            ...notAvailableStock,
            ...availableItems,
            ...unAvailableItems,
          ].filter(
            (item, index, self) =>
              index === self.findIndex((i) => i.sku === item.sku)
          );

          console.log("newSorted===", newSorted);

          setSummaryProducts({ ...data, items: newSorted });
        }

        const clientSecret = data.paymentIntent.client_secret;
        setClientSecret(clientSecret);
        // {
        //   router.push(
        //     `/checkout/${clientSecret}?amount=${data.paymentIntent.amount}`
        //   );
        // }
      } else {
        toast.error("กรุณาระบุที่อยู่การจัดส่ง");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkAvailableForCheckout = async () => {
    if (!currentUser) {
      router.push("/login-line"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเชื่อมต่อไลน์");
      return;
    }
    if (!currentUser.phoneVerified) {
      router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      return;
    }

    if (items.length === 0) {
      return;
    }

    setIsOpen(true);

    try {
      const productItems: CheckProductAvailabilityForUserPayloadType = {
        items: items,
      };

      const result = await checkProductAvailabilityForUser(productItems);

      if (result) {
        console.log("result===", result);

        const availableItems = result.data.items.filter(
          (item) =>
            item.warningMessage === null && item.isAvailableStock !== false
        );

        const unAvailableItems = result.data.items.filter(
          (item) =>
            item.warningMessage !== null && item.isAvailableStock !== false
        );

        const notAvailableStock = result.data.items.filter(
          (item) => item.isAvailableStock === false
        );

        console.log("availableItems", availableItems);
        console.log("unAvailableItems", unAvailableItems);
        console.log("notAvailableStock", notAvailableStock);

        const newSorted = [
          ...notAvailableStock,
          ...availableItems,
          ...unAvailableItems,
        ].filter(
          (item, index, self) =>
            index === self.findIndex((i) => i.sku === item.sku)
        );

        console.log("newSorted===", newSorted);

        setSummaryProducts({ ...result.data, items: newSorted });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        // onClick={checkAvailableForCheckout}
        // onClick={handleCheckout}
        disabled={!singleItem && (!cartItems || cartItems.length === 0)}
        size={"lg"}
        className="text-lg"
      >
        สั่งซื้อสินค้า
      </Button>
      <SheetTitle />
      <SheetContent className="w-full md:w-[540px] overflow-y-auto">
        <h1 className="text-2xl font-semibold text-center">
          ดำเนินการสั่งซื้อ{" "}
        </h1>
        <div className="flex flex-col gap-4 my-6">
          <h1 className="text-xl font-semibold">รายการสินค้า : </h1>
          {summaryProducts?.items.map((item, i) => (
            <div key={item.productId + i} className="p-2 border rounded-sm">
              <div>{item.name}</div>
              <div>{item.variantOptions}</div>
              <div>{item.quantity}</div>
              <div>{item.unitPrice}</div>
              <div>{item.discount}</div>
              {!item.isAvailableStock && <div>ไม่สามารถสั่งซื้อได้</div>}
              {item.warningMessage && <div>{item.warningMessage}</div>}
            </div>
          ))}
        </div>

        <AddressSelector />

        <Button
          size={"lg"}
          className="w-full text-lg my-4"
          onClick={handleCheckout}
          disabled={!singleItem && (!cartItems || cartItems.length === 0)}
        >
          ยืนยัน
        </Button>
        {summaryProducts && <OrderSummary orderData={summaryProducts} />}
      </SheetContent>
    </Sheet>
  );
}
