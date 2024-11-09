"use client";

import Link from "next/link";
import { MdArrowBack } from "react-icons/md";
import ItemContent from "./ItemContent";
import { formatPrice } from "@/utils/formatPrice";
import { Button } from "@/components/ui/button";
import Heading from "@/components/shared/Heading";
import { PackageX } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartProductStore } from "@/state-stores/cartProductStore";
import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { SafeUser } from "@/types";

// interface CartClientProps {
//   currentUser: SafeUser | null;
// }

// export default function CartClient({ currentUser }: CartClientProps) {
export default function CartClient() {
  // const { cartProducts, handleClearCart, cartTotalAmount } = useCart();
  const cartProducts = useCartProductStore((state) => state.cartProducts);
  const clearCart = useCartProductStore((state) => state.clearCart);
  const setCartTotalQty = useCartProductStore((state) => state.setCartTotalQty);
  const cartTotalAmount = useCartProductStore((state) => state.cartTotalAmount);
  const setCartTotalAmount = useCartProductStore(
    (state) => state.setCartTotalAmount
  );

  const router = useRouter();

  useEffect(() => {
    const getTotal = () => {
      if (cartProducts) {
        const { total, qty } = cartProducts?.reduce(
          (acc, item) => {
            const itemTotal = item.price * item.quantity;
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
  });

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="py-28 flex flex-col items-center">
        <PackageX size={40} />
        <div className="text-xl">ตะกร้าว่างเปล่า</div>
        <div>
          <Link
            href={"/"}
            className="text-slate-500 flex items-center gap-1 mt-2"
          >
            <MdArrowBack />
            <span>เลือกดูสินค้า</span>
          </Link>
        </div>
      </div>
    );
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
        {cartProducts &&
          cartProducts.map((item) => {
            return <ItemContent key={item.id} item={item} />;
          })}
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
          {/* <button
            className="w-full btn btn-primary text-base-400 font-light"
            onClick={() =>
              currentUser ? router.push("/checkout") : router.push("/login")
            }
          >
            {currentUser ? "Checkout" : "Login To Checkout"}
          </button> */}
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
