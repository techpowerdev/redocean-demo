"use client";

import { Button } from "@/components/ui/button";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import { AddProductToCardInputType } from "@/types/cartTypes";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

type Props = {
  isActive?: boolean;
  product: AddProductToCardInputType;
  stock: number;
};

export default function AddProductToCart({ isActive, product, stock }: Props) {
  // global state
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const handleAddProductToCart = useCartServerStore(
    (state) => state.handleAddProductToCart
  );

  // other
  const router = useRouter();

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
      handleAddProductToCart(product);
    } catch (error) {
      console.log(error);
    }
  };

  // const isProductInCart =
  //   cart?.cartItems?.some((item) => item.sku === product.sku) || false;
  const isOutOfStock = stock <= 0; // `true` when no stock is available
  // const disableButton = isOutOfStock; // Button is disabled if product out of stock

  // return isProductInCart ? (
  //   <div>
  //     <p className="mb-2 text-slate-500 flex items-center gap-1">
  //       <MdCheckCircle className="text-teal-400" size={20} />
  //       <span>เพิ่มสินค้าในตะกร้าแล้ว</span>
  //     </p>
  //     <Button
  //       size={"lg"}
  //       className="w-full lg:w-1/2 bg-primary text-lg"
  //       onClick={() => router.push("/cart")}
  //     >
  //       ดูตะกร้าสินค้า
  //     </Button>
  //   </div>
  // ) : (
  //   <div className="flex flex-col justify-start items-start gap-2">
  //     <Button
  //       size={"lg"}
  //       className="w-full lg:w-1/2 bg-primary text-lg"
  //       // disabled={!isEventTime}
  //       disabled={isProductInCart}
  //       onClick={handleAddToCart}
  //     >
  //       เพิ่มสินค้าลงตะกร้า
  //     </Button>
  //     {isOutOfStock ? (
  //       <span className="text-red-500 font-semibold">สินค้าหมด</span>
  //     ) : (
  //       <span className="text-red-500 font-semibold">
  //         เหลืออีก {stock} ชิ้น
  //       </span>
  //     )}
  //   </div>
  // );
  return (
    <div className="flex flex-col justify-start items-start gap-2">
      <Button
        size={"lg"}
        className="w-full lg:w-1/2 bg-primary text-lg"
        disabled={!isActive || isOutOfStock}
        onClick={handleAddToCart}
      >
        เพิ่มสินค้าลงตะกร้า
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
