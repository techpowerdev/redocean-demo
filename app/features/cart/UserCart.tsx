"use client";

import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import Heading from "@/components/shared/Heading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import EmptyCart from "./EmptyCart";
import { fetchCart } from "@/services/cartServices";
import CartItem from "./CartItem";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import { ShoppingCart } from "lucide-react";
import { checkStockAndPromotionForCheckout } from "@/services/orderServices";
import toast from "react-hot-toast";
import axios from "axios";

export default function CartClient() {
  const setCart = useCartServerStore((state) => state.setCart);
  const cart = useCartServerStore((state) => state.cart);
  const clearCart = useCartServerStore((state) => state.clearCart);

  const router = useRouter();

  const handleCheckout = async () => {
    try {
      const isStockSufficient = await checkStockAndPromotionForCheckout(
        cart?.cartItems || []
      );

      if (isStockSufficient) {
        router.push("/checkout");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data);
        toast.error(error.response?.data.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCart();
        setCart(response);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []); // กำหนดค่าให้ดึงตะกร้าใหม่ เมื่อมีการ เพิ่ม ลบ แก้ไข ล้างตะกร้า

  if (!cart || cart.cartItems.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div>
      <div className="flex justify-between items-center gap-4 py-4">
        <Heading title="ตะกร้าสินค้า" center />
        <ShoppingCart size={30} className="text-gray-300" />
      </div>
      <div>
        {cart.cartItems?.map((item) => (
          <div key={item.id}>
            <CartItem item={item} />
          </div>
        ))}
      </div>
      <div className="border-t-[1.5px] border-slate-200 py-4 flex flex-col justify-between gap-4 sm:flex-row">
        <div className="w-[120px]">
          <Button
            className="w-full bg-primary uppercase"
            onClick={() => clearCart()}
          >
            ล้างข้อมูลตะกร้า
          </Button>
        </div>
        <div className="text-sm flex flex-col gap-1 items-end">
          <div className="flex justify-between w-full text-base font-medium">
            <span>รวมทั้งสิ้น</span>
            <span>{formatPrice(cart.cartTotalAmount)}</span>
          </div>
          <p className="text-slate-500">ยังไม่รวมค่าธรรมเนียมและค่าขนส่ง</p>
          <Button size={"lg"} className="text-lg" onClick={handleCheckout}>
            ชำระเงิน
          </Button>
        </div>
      </div>
    </div>
  );
}
