// import { getProductVariantStock } from "@/actions/productServices";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type CartProductType = {
  productId: string;
  productVariantId: string;
  promotionType: string;
  promotionId?: string | null;
  name: string;
  description: string;
  sku: string | null;
  color: string | null;
  size: string | null;
  image: string;
  quantity: number;
  unitPrice: number;
  discount?: number | null;
  stock: number;
};

export type State = {
  cartProducts: CartProductType[] | null;
  cartTotalQty: number;
  cartTotalAmount: number;
};

export type Action = {
  addProductsToCart: (product: CartProductType[]) => void;
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
        addProductsToCart: (product) =>
          set((state) => ({
            cartProducts: state.cartProducts
              ? [...state.cartProducts, ...product] // เพิ่ม products ลงใน cartProducts ถ้าไม่เป็น null
              : product, // ถ้า cartProducts เป็น null ให้เริ่มต้นด้วย product
          })),
        handleRemoveProductFromCart: (product) =>
          set((state) => ({
            cartProducts: state.cartProducts
              ? state.cartProducts.filter(
                  (item) => item.productVariantId !== product.productVariantId
                ) // ลบสินค้าจาก cartProducts
              : null, // ถ้า cartProducts เป็น null ให้ตั้งค่ากลับเป็น null
          })),
        handleCartQtyIncrease: (product) =>
          set((state) => ({
            cartProducts: state.cartProducts
              ? state.cartProducts.map((item) =>
                  item.productVariantId === product.productVariantId
                    ? { ...item, quantity: item.quantity + 1 } // เพิ่ม quantity ของสินค้าที่เลือก
                    : item
                )
              : null, // ถ้า cartProducts เป็น null ให้ตั้งค่ากลับเป็น null
          })),
        handleCartQtyDecrease: (product) =>
          set((state) => ({
            cartProducts: state.cartProducts
              ? state.cartProducts.map((item) =>
                  item.productVariantId === product.productVariantId &&
                  item.quantity > 1
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

// // version 2
// export const useCartProductStore = create<State & Action>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         cartProducts: null,
//         cartTotalQty: 0,
//         cartTotalAmount: 0,

//         // ฟังก์ชันเพิ่มสินค้าเข้า Cart
//         addProductsToCart: (product) =>
//           set((state) => ({
//             cartProducts: state.cartProducts
//               ? [...state.cartProducts, ...product] // เพิ่ม products ลงใน cartProducts ถ้าไม่เป็น null
//               : product, // ถ้า cartProducts เป็น null ให้เริ่มต้นด้วย product
//           })),

//         // ฟังก์ชันเพิ่มจำนวนสินค้าใน Cart
//         handleCartQtyIncrease: async (product: CartProductType) => {
//           const stockAvailable = await getProductVariantStock(
//             product.productVariantId
//           );

//           set((state) => {
//             const updatedCart =
//               state.cartProducts?.map((item) => {
//                 if (item.productVariantId === product.productVariantId) {
//                   if (item.quantity + 1 > stockAvailable) {
//                     toast.error("จำนวนสินค้าไม่เพียงพอ");
//                     return item;
//                   }
//                   return { ...item, quantity: item.quantity + 1 };
//                 }
//                 return item;
//               }) || null;

//             return {
//               cartProducts: updatedCart,
//             };
//           });
//         },

//         // ฟังก์ชันลดจำนวนสินค้าใน Cart
//         handleCartQtyDecrease: (product: CartProductType) =>
//           set((state) => ({
//             cartProducts: state.cartProducts
//               ? state.cartProducts.map((item) =>
//                   item.productVariantId === product.productVariantId &&
//                   item.quantity > 1
//                     ? { ...item, quantity: item.quantity - 1 }
//                     : item
//                 )
//               : null,
//           })),

//         // ฟังก์ชันลบสินค้าออกจาก Cart
//         handleRemoveProductFromCart: (product: CartProductType) =>
//           set((state) => ({
//             cartProducts: state.cartProducts
//               ? state.cartProducts.filter(
//                   (item) => item.productVariantId !== product.productVariantId
//                 )
//               : null,
//           })),

//         setCartTotalQty: (qty) => set({ cartTotalQty: qty }),
//         setCartTotalAmount: (totalAmount) =>
//           set({ cartTotalAmount: totalAmount }),
//         clearCart: () => set({ cartProducts: null }),
//       }),
//       { name: "cartProducts" }
//     )
//   )
// );
