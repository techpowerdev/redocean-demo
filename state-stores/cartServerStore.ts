import {
  addProductItemToCart,
  clearCart,
  decreaseProductItemQty,
  fetchCart,
  increaseProductItemQty,
  removeProductItemFormCart,
} from "@/services/cartServices";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AxiosError } from "axios";
import { CartProductType } from "@/types/productTypes";
import { CartType } from "@/types/cartTypes";

export type State = {
  cart: CartType | null;
  cartTotalQty: number;
  cartTotalAmount: number;
};

export type Action = {
  setCart: (cart: CartType) => void;
  clearCart: () => void;
  handleAddProductToCart: (product: CartProductType) => void;
  handleRemoveProductFromCart: (id: string) => void;
  handleCartQtyIncrease: (id: string, quantity: number) => void;
  handleCartQtyDecrease: (id: string, quantity: number) => void;
  setCartTotalQty: (qty: number) => void;
  setCartTotalAmount: (totalAmount: number) => void;
};

export const useCartServerStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        cart: null,
        cartTotalQty: 0,
        cartTotalAmount: 0,

        setCart: (cart) => set({ cart }),

        handleAddProductToCart: async (productItem) => {
          try {
            const response = await addProductItemToCart(productItem);
            toast.success(response?.message || "เพิ่มสินค้าแล้ว");
            // const updatedCart = await fetchCart().then((res) => res.data);
            const updatedCart = await fetchCart().then((res) => res);
            set({ cart: updatedCart });
          } catch (error) {
            if (error instanceof AxiosError) {
              const errorMessage =
                error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ";
              toast.error(errorMessage);
            } else {
              toast.error("เกิดข้อผิดพลาดบางอย่าง");
            }
          }
        },

        handleRemoveProductFromCart: async (id) => {
          try {
            const response = await removeProductItemFormCart(id);
            toast.success(response?.message || "ลบสินค้าแล้ว");
            // const updatedCart = await fetchCart().then((res) => res.data);
            const updatedCart = await fetchCart().then((res) => res);
            set({ cart: updatedCart });
          } catch (error) {
            if (error instanceof AxiosError) {
              const errorMessage =
                error.response?.data?.message || "ลบสินค้าไม่สำเร็จ";
              toast.error(errorMessage);
            } else {
              toast.error("เกิดข้อผิดพลาดบางอย่าง");
            }
          }
        },

        handleCartQtyIncrease: async (id, quantity) => {
          try {
            await increaseProductItemQty(id, quantity);
            const updatedCart = await fetchCart().then((res) => res);
            set({ cart: updatedCart });
          } catch (error) {
            if (error instanceof Error) {
              const errorMessage = error.message;
              toast.error(errorMessage);
            } else {
              toast.error("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
            }
          }
        },

        handleCartQtyDecrease: async (id, quantity) => {
          try {
            await decreaseProductItemQty(id, quantity);
            const updatedCart = await fetchCart().then((res) => res);
            set({ cart: updatedCart });
          } catch (error) {
            if (error instanceof AxiosError) {
              const errorMessage =
                error.response?.data?.message || "แก้ไขจำนวนสินค้าไม่สำเร็จ";
              toast.error(errorMessage);
            } else {
              console.error("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
            }
          }
        },

        setCartTotalQty: (qty) => set({ cartTotalQty: qty }),
        setCartTotalAmount: (totalAmount) =>
          set({ cartTotalAmount: totalAmount }),

        clearCart: async () => {
          try {
            await clearCart();
            const updatedCart = await fetchCart().then((res) => res);
            set({ cart: updatedCart });
          } catch (error) {
            if (error instanceof AxiosError) {
              const errorMessage =
                error.response?.data?.message || "ล้างตะกร้าไม่สำเร็จ";
              toast.error(errorMessage);
              console.error(errorMessage);
            } else {
              toast.error("เกิดข้อผิดพลาดบางอย่าง");
              console.error(error);
            }
          }
        },
      }),
      { name: "khumkha-cart" }
    )
  )
);
