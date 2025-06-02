"use client";

import { VoucherGroup } from "@/types/baseTypes";
import React, { useCallback, useState } from "react";
import GiftVoucherCard from "@/app/features/voucher/GiftVoucherCard";
import { Button } from "@/components/ui/button";
import SetVoucherQuantity from "@/app/features/voucher/SetVoucherQuantity";
import { BuyVoucherParams } from "@/types/voucherTypes";
import { buyVoucher } from "@/services/voucherServices";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";

type Props = {
  voucherGroup: VoucherGroup;
};

export default function BuyVoucherClient({ voucherGroup }: Props) {
  // global state
  const getCurrentUser = useCurrentUserStore((state) => state.getCurrentUser);

  const [buyVoucherData, setBuyVoucherData] = useState<BuyVoucherParams>({
    voucherGroupId: voucherGroup.id,
    quantity: 1,
  });

  const router = useRouter();

  const handleQtyIncrease = useCallback(async () => {
    setBuyVoucherData((prev) => {
      return { ...prev, quantity: prev.quantity + 1 };
    });
  }, []);

  const handleQtyDecrease = useCallback(() => {
    if (buyVoucherData.quantity === 1) {
      return;
    }

    setBuyVoucherData((prev) => {
      return { ...prev, quantity: prev.quantity - 1 };
    });
  }, [buyVoucherData]);

  const handleBuyVoucher = async () => {
    try {
      const cUser = await getCurrentUser();
      console.log("cUser", cUser);
      // if (!currentUser) {
      //   router.push("/login-line-liff"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      //   toast.error("กรุณาเชื่อมต่อไลน์");
      //   return;
      // }

      // if (!currentUser.phoneVerified) {
      //   router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      //   return;
      // }

      const result = await buyVoucher(buyVoucherData);
      const clientSecret = result?.data?.paymentIntent?.client_secret;
      if (clientSecret) {
        router.push(`/checkout/${clientSecret}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  };

  return (
    <GiftVoucherCard
      storeName={voucherGroup.storeName}
      value={voucherGroup.amount}
      expiryDate={voucherGroup.expiresAt}
      backgroundColor="#DC2626"
      textColor="#ffffff"
      borderColor="#DC2626"
    >
      <SetVoucherQuantity
        quantity={buyVoucherData.quantity}
        handleQtyDecrease={handleQtyDecrease}
        handleQtyIncrease={handleQtyIncrease}
      />
      <Button
        onClick={handleBuyVoucher}
        disabled={!buyVoucherData}
        className="w-full mt-2"
      >
        สั่งซื้อ
      </Button>
    </GiftVoucherCard>
  );
}
