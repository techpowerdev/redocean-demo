import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type CartProductType = {
  id: string;
  orderType: string;
  name: string;
  description: string;
  image: string; // object type
  quantity: number;
  price: number;
};

export type State = {
  cartProducts: CartProductType[] | null;
  cartTotalQty: number;
  cartTotalAmount: number;
};

export type Action = {
  setCartProducts: (product: CartProductType[]) => void;
  clearCart: () => void;
  handleRemoveProductFromCart: (product: CartProductType) => void;
  handleCartQtyIncrease: (product: CartProductType) => void;
  handleCartQtyDecrease: (product: CartProductType) => void;
  setCartTotalQty: (qty: number) => void;
  setCartTotalAmount: (totalAmount: number) => void;
};

export const useCartProductStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        cartProducts: null,
        cartTotalQty: 0,
        cartTotalAmount: 0,
        setCartProducts: (product) =>
          set((state) => ({
            cartProducts: state.cartProducts
              ? [...state.cartProducts, ...product] // เพิ่ม products ลงใน cartProducts ถ้าไม่เป็น null
              : product, // ถ้า cartProducts เป็น null ให้เริ่มต้นด้วย product
          })),
        handleRemoveProductFromCart: (product) =>
          set((state) => ({
            cartProducts: state.cartProducts
              ? state.cartProducts.filter((item) => item.id !== product.id) // ลบสินค้าจาก cartProducts
              : null, // ถ้า cartProducts เป็น null ให้ตั้งค่ากลับเป็น null
          })),
        handleCartQtyIncrease: (product) =>
          set((state) => ({
            cartProducts: state.cartProducts
              ? state.cartProducts.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 } // เพิ่ม quantity ของสินค้าที่เลือก
                    : item
                )
              : null, // ถ้า cartProducts เป็น null ให้ตั้งค่ากลับเป็น null
          })),
        handleCartQtyDecrease: (product) =>
          set((state) => ({
            cartProducts: state.cartProducts
              ? state.cartProducts.map((item) =>
                  item.id === product.id && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 } // ลด quantity ของสินค้าที่เลือกถ้าปริมาณ > 1
                    : item
                )
              : null, // ถ้า cartProducts เป็น null ให้ตั้งค่ากลับเป็น null
          })),
        setCartTotalQty: (qty) => set({ cartTotalQty: qty }),
        setCartTotalAmount: (totalAmount) =>
          set({ cartTotalAmount: totalAmount }),
        clearCart: () => set({ cartProducts: null }),
      }),
      { name: "cartProducts" }
    )
  )
);
