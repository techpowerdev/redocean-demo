"use client";

import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import Heading from "@/components/shared/Heading";
import { useRouter } from "next/navigation";
import { useCartProductStore } from "@/state-stores/cartProductStore";
import { useEffect } from "react";
import EmptyCart from "./EmptyCart";
import ItemContent from "./ItemContent";
// import { fetchCart } from "@/services/cartServices";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";

export default function CartClient() {
  // const token = useCurrentUserStore((state) => state.token);
  // const { cartProducts, handleClearCart, cartTotalAmount } = useCart();

  // const addProductsToCart = useCartProductStore(
  //   (state) => state.addProductsToCart
  // );
  const cartProducts = useCartProductStore((state) => state.cartProducts);
  const clearCart = useCartProductStore((state) => state.clearCart);
  const setCartTotalQty = useCartProductStore((state) => state.setCartTotalQty);
  const cartTotalAmount = useCartProductStore((state) => state.cartTotalAmount);
  const setCartTotalAmount = useCartProductStore(
    (state) => state.setCartTotalAmount
  );

  const router = useRouter();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetchCart(token || "");
  //       // .then(addProductsToCart); // ดึงข้อมูลตะกร้าเมื่อโหลดหน้า
  //       console.log("response", response.data.cartItems);
  //       addProductsToCart(response.data.cartItems);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  useEffect(() => {
    const getTotal = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.unitPrice * item.quantity;
            acc.total += itemTotal;
            acc.qty += item.quantity;
            return acc;
          },
          { total: 0, qty: 0 }
        );
        setCartTotalQty(qty);
        setCartTotalAmount(total);
      }
    };
    getTotal();
  }, []);

  if (!cartProducts || cartProducts.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div>
      <Heading title="รายการสินค้าทั้งหมด" center />
      <div className="grid grid-cols-5 gap-4 pb-2 items-center mt-8">
        <div className="col-span-1 sm:col-span-2 justify-self-start">
          ชื่อสินค้า
        </div>
        <div className="justify-self-center">ราคา</div>
        <div className="col-span-2 sm:col-span-1 justify-self-center">
          จำนวน
        </div>
        <div className="justify-self-end">รวม</div>
      </div>
      <div>
        {cartProducts?.map((item) => (
          <div key={item.id}>
            <ItemContent item={item} />
          </div>
        ))}
      </div>
      <div className="border-t-[1.5px] border-slate-200 py-4 flex flex-col justify-between gap-4 sm:flex-row">
        <div className="w-[120px]">
          <Button className="w-full bg-primary uppercase" onClick={clearCart}>
            ล้างข้อมูลตะกร้า
          </Button>
        </div>
        <div className="text-sm flex flex-col gap-1 items-end">
          <div className="flex justify-between w-full text-base font-medium">
            <span>รวมทั้งสิ้น</span>
            <span>{formatPrice(cartTotalAmount)}</span>
          </div>
          <p className="text-slate-500">ยังไม่รวมค่าธรรมเนียมและค่าขนส่ง</p>
          <Button
            size={"lg"}
            className="text-lg"
            onClick={() => router.push("/checkout")}
          >
            ชำระเงิน
          </Button>
        </div>
      </div>
    </div>
  );
}
