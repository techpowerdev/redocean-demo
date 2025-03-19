import {
  addProductItemToCart,
  clearCart,
  decreaseProductItemQty,
  getUserCart,
  increaseProductItemQty,
  removeProductItemFormCart,
} from "@/services/cartServices";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AddProductToCardParam, CartProductType } from "@/types/cartTypes";

export type State = {
  cart: CartProductType | null;
  cartTotalQty: number;
  cartTotalAmount: number;
};

export type Action = {
  setCart: (cart: CartProductType) => void;
  clearCart: () => void;
  handleAddProductToCart: (product: AddProductToCardParam) => void;
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
            // const updatedCart = await getUserCart().then((res) => res.data);
            const updatedCart = await getUserCart();
            set({ cart: updatedCart.data });
          } catch (error) {
            if (error instanceof Error) {
              const errorMessage = error.message;
              toast.error(errorMessage);
            }
          }
        },

        handleRemoveProductFromCart: async (id) => {
          try {
            const response = await removeProductItemFormCart(id);
            toast.success(response?.message || "ลบสินค้าแล้ว");
            // const updatedCart = await getUserCart().then((res) => res.data);
            const updatedCart = await getUserCart();
            set({ cart: updatedCart.data });
          } catch (error) {
            if (error instanceof Error) {
              const errorMessage = error.message;
              toast.error(errorMessage);
            }
          }
        },

        handleCartQtyIncrease: async (id, quantity) => {
          try {
            await increaseProductItemQty(id, quantity);
            const updatedCart = await getUserCart();
            set({ cart: updatedCart.data });
          } catch (error) {
            if (error instanceof Error) {
              const errorMessage = error.message;
              toast.error(errorMessage);
            }
          }
        },

        handleCartQtyDecrease: async (id, quantity) => {
          try {
            await decreaseProductItemQty(id, quantity);
            const updatedCart = await getUserCart();
            set({ cart: updatedCart.data });
          } catch (error) {
            if (error instanceof Error) {
              const errorMessage = error.message;
              toast.error(errorMessage);
            }
          }
        },

        setCartTotalQty: (qty) => set({ cartTotalQty: qty }),
        setCartTotalAmount: (totalAmount) =>
          set({ cartTotalAmount: totalAmount }),

        clearCart: async () => {
          try {
            await clearCart();
            const updatedCart = await getUserCart();
            set({ cart: updatedCart.data });
          } catch (error) {
            if (error instanceof Error) {
              const errorMessage = error.message;
              toast.error(errorMessage);
            }
          }
        },
      }),
      { name: "khumkha-cart" }
    )
  )
);
