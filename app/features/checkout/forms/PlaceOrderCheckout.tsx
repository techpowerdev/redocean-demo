"use client";

import { useAddressStore } from "@/state-stores/addressStore";
import React, { useState } from "react";
import AddressSelector from "@/app/features/address/forms/AddressSelector";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

import toast from "react-hot-toast";

import { useRouter } from "next/navigation";

import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import OrderSummary from "./OrderSummary";

import { createOrderWithPaymentIntent } from "@/services/orderServices";
import {
  CreateOrderItem,
  CreateOrderWithPaymentIntentParams,
  OrderWithPaymentIntent,
} from "@/types/orderTypes";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { ShippingAddress } from "@/types/addressTypes";

type Props = {
  singleItem?: CreateOrderItem;
  cartItems?: CreateOrderItem[];
};

export default function PlaceOrderCheckout({ singleItem, cartItems }: Props) {
  // global state
  const selectedAddress = useAddressStore((state) => state.selectedAddress);
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const clearCart = useCartServerStore((state) => state.clearCart);

  // local state
  const [summaryProducts, setSummaryProducts] =
    useState<OrderWithPaymentIntent | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะของ Sheet
  const [isOpen2, setIsOpen2] = useState(false); // จัดการสถานะของ Sheet
  const [creatingOrder, setCreatingOrder] = useState(false);

  // navigation
  const router = useRouter();

  const items = singleItem ? [singleItem] : cartItems || [];

  const handleOpenPlaceOrderForm = () => {
    if (!currentUser) {
      router.push("/login-line"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเชื่อมต่อไลน์");
      return;
    }

    if (!currentUser.phoneVerified) {
      router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      return;
    }
    setIsOpen(true);
  };
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
    setCreatingOrder(true);
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

        const shippingAddress: ShippingAddress = {
          recipient,
          phoneNumber,
          address,
          street,
          subDistrict,
          district,
          province,
          postalCode,
        };

        // สร้างข้อมูลใหม่ที่มีเฉพาะฟิลด์ที่ต้องการ
        const createPaymentData: CreateOrderWithPaymentIntentParams = {
          items: items,
          shippingAddress: shippingAddress,
          captureLater: true,
        };
        const { data } = await createOrderWithPaymentIntent(createPaymentData);

        if (data) {
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
          setIsOpen(false);
          setIsOpen2(true);
        }

        const clientSecret = data.paymentIntent.client_secret;
        setClientSecret(clientSecret);
      } else {
        toast.error("กรุณาระบุที่อยู่การจัดส่ง");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingOrder(false);
    }
  };

  const handleNextProcess = async () => {
    if (cartItems?.length && cartItems?.length > 0) {
      clearCart();
    }
    router.push(`/checkout/${clientSecret}`);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <Button
          size={"lg"}
          onClick={handleOpenPlaceOrderForm}
          disabled={!singleItem && (!cartItems || cartItems.length === 0)}
          className="text-lg"
        >
          สั่งซื้อสินค้า
        </Button>
        <SheetTitle />
        <SheetContent className="w-full md:w-[540px] overflow-y-auto">
          <AddressSelector />

          <Button
            size={"lg"}
            className="w-full text-lg my-4"
            onClick={handleCheckout}
            disabled={creatingOrder || (!singleItem && !cartItems?.length)}
          >
            {creatingOrder ? "กำลังดำเนินการ..." : " ยืนยัน"}
          </Button>
        </SheetContent>
      </Sheet>
      <Sheet open={isOpen2} onOpenChange={setIsOpen2}>
        <SheetTitle />
        <SheetContent className="w-full md:w-[540px] overflow-y-auto">
          {summaryProducts && (
            <>
              <OrderSummary orderData={summaryProducts} />

              <Button
                size={"lg"}
                disabled={!summaryProducts?.nextProcess}
                onClick={handleNextProcess}
                className="w-full text-lg my-4"
              >
                ดำเนินการชำระเงิน
              </Button>
              {!summaryProducts?.nextProcess && (
                <span className="text-red-500">{`** ไม่สามารถสั่งซื้อได้ โปรดตรวจสอบรายการสินค้า`}</span>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
