"use client";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/authServices";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { ProductModel } from "@/types/baseTypes";
import { GetCurrentUserResponse } from "@/types/userTypes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Props = {
  selectedModel: ProductModel | null;
  buyProductData: {
    productItemId: string;
    productModelId: string;
    quantity: number;
    promotionId: string | null;
    promotionType: string | null;
    promotionActivityId: string | null;
  };
};
export default function AddToCartButton({
  selectedModel,
  buyProductData,
}: Props) {
  // global state
  const handleAddProductToCart = useCartServerStore(
    (state) => state.handleAddProductToCart
  );

  // local state
  const [currentUser, setCurrentUser] = useState<
    GetCurrentUserResponse["data"] | null
  >(null);

  // navigation
  const router = useRouter();

  const checkAuth = () => {
    if (!currentUser) {
      router.push("/login"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      return;
    }

    if (!currentUser.phoneVerified) {
      router.push("/verify-user"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      return;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUser();
      setCurrentUser(data);
    };
    fetchData();
  }, [router]);

  return (
    <div className="w-full">
      <Button
        disabled={!selectedModel || selectedModel.stock === 0}
        className="w-full bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={() => {
          checkAuth();
          handleAddProductToCart(buyProductData);
        }}
      >
        เพิ่มลงตะกร้า
      </Button>
    </div>
  );
}
