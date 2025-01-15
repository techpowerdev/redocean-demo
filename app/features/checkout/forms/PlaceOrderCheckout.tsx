import { useAddressStore } from "@/state-stores/addressStore";
import React from "react";
import AddressSelector from "@/app/features/address/forms/AddressSelector";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import toast from "react-hot-toast";
import { StripeCreatePaymentIntent } from "@/services/stripeServices";
import {
  StripeCreatePaymentIntentProductItemType,
  StripeCreatePaymentIntentType,
} from "@/types/stripeTypes";

type Props = {
  singleItem?: StripeCreatePaymentIntentProductItemType;
  cartItems?: StripeCreatePaymentIntentProductItemType[];
};

export default function PlaceOrderCheckout({ singleItem, cartItems }: Props) {
  // global state
  const selectedAddress = useAddressStore((state) => state.selectedAddress);

  const handleCheckout = async () => {
    console.log("singleItem==", singleItem);
    console.log("cartItems==", cartItems);
    console.log("selectedAddress==", selectedAddress);
    try {
      const items = singleItem ? [singleItem] : cartItems || [];

      if (items.length === 0) {
        return;
      }

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

        const data: StripeCreatePaymentIntentType = {
          items,
          shippingAddress,
        };
        console.log("data==", data);

        const response = await StripeCreatePaymentIntent(data);
        // if (!response.ok) {
        //   throw new Error("Failed to create payment intent.");
        // }
        // const { clientSecret, error } = await response.json();
        // if (error) {
        //   throw new Error(error);
        // }
      } else {
        toast.error("กรุณาระบุที่อยู่การจัดส่ง");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"lg"} className="text-lg">
          สั่งซื้อสินค้า
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full md:w-[540px]">
        <AddressSelector />
        <Button
          size={"lg"}
          className="w-full text-lg my-4"
          onClick={handleCheckout}
          disabled={!singleItem && (!cartItems || cartItems.length === 0)}
        >
          ยืนยัน
        </Button>
      </SheetContent>
    </Sheet>
  );
}
