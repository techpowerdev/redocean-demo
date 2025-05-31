"use client";

import { Button } from "@/components/ui/button";
import { addProductItemToCart } from "@/services/cartServices";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { ProductModel } from "@/types/baseTypes";
import React from "react";
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
  const handleAddProductToCart = useCartServerStore(
    (state) => state.handleAddProductToCart
  );
  const addProductToCard = async () => {
    if (!buyProductData) return;

    try {
      await addProductItemToCart(buyProductData);
    } catch (error) {
      // toast.error(error.message);
      console.log(error);
    }
  };
  return (
    <div className="w-full">
      <Button
        disabled={!selectedModel || selectedModel.stock === 0}
        className="w-full bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={() => handleAddProductToCart(buyProductData)}
      >
        เพิ่มลงตะกร้า
      </Button>
    </div>
  );
}
