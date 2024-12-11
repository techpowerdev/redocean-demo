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
  clearCart: (token: string) => void;
  handleAddProductToCart: (token: string, product: CartProductType) => void;
  handleRemoveProductFromCart: (token: string, id: string) => void;
  handleCartQtyIncrease: (token: string, id: string, quantity: number) => void;
  handleCartQtyDecrease: (token: string, id: string, quantity: number) => void;
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

        handleAddProductToCart: async (token, productItem) => {
          try {
            const response = await addProductItemToCart(token, productItem);
            toast.success(response?.message || "เพิ่มสินค้าแล้ว");
            const updatedCart = await fetchCart(token).then((res) => res.data);
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

        handleRemoveProductFromCart: async (token, id) => {
          try {
            const response = await removeProductItemFormCart(token, id);
            toast.success(response?.message || "ลบสินค้าแล้ว");
            const updatedCart = await fetchCart(token).then((res) => res.data);
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

        handleCartQtyIncrease: async (token, id, quantity) => {
          try {
            await increaseProductItemQty(token, id, quantity);
            // const response = await updateProductItemQty(token, id, quantity);
            // toast.success(response?.message || "แก้ไขจำนวนสินค้าแล้ว");
            const updatedCart = await fetchCart(token).then((res) => res.data);
            set({ cart: updatedCart });
          } catch (error) {
            if (error instanceof AxiosError) {
              const errorMessage =
                error.response?.data?.message || "แก้ไขจำนวนสินค้าไม่สำเร็จ";
              toast.error(errorMessage);
            } else {
              toast.error("เกิดข้อผิดพลาดบางอย่าง");
            }
          }
        },

        handleCartQtyDecrease: async (token, id, quantity) => {
          try {
            await decreaseProductItemQty(token, id, quantity);
            const updatedCart = await fetchCart(token).then((res) => res.data);
            set({ cart: updatedCart });
          } catch (error) {
            if (error instanceof AxiosError) {
              const errorMessage =
                error.response?.data?.message || "แก้ไขจำนวนสินค้าไม่สำเร็จ";
              toast.error(errorMessage);
            } else {
              toast.error("เกิดข้อผิดพลาดบางอย่าง");
            }
          }
        },

        setCartTotalQty: (qty) => set({ cartTotalQty: qty }),
        setCartTotalAmount: (totalAmount) =>
          set({ cartTotalAmount: totalAmount }),

        clearCart: async (token) => {
          try {
            await clearCart(token);
            const updatedCart = await fetchCart(token).then((res) => res.data);
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
