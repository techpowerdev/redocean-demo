// // import { getProductVariantStock } from "@/actions/productServices";
// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// export type CartProductType = {
//   productId: string;
//   productVariantId: string;
//   promotionType: string;
//   promotionId?: string | null;
//   name: string;
//   description: string;
//   sku: string | null;
//   color: string | null;
//   size: string | null;
//   image: string;
//   quantity: number;
//   unitPrice: number;
//   discount?: number | null;
//   stock: number;
// };

// export type State = {
//   cartProducts: CartProductType[] | null;
//   cartTotalQty: number;
//   cartTotalAmount: number;
// };

// export type Action = {
//   addProductsToCart: (product: CartProductType[]) => void;
//   clearCart: () => void;
//   handleRemoveProductFromCart: (product: CartProductType) => void;
//   handleCartQtyIncrease: (product: CartProductType) => void;
//   handleCartQtyDecrease: (product: CartProductType) => void;
//   setCartTotalQty: (qty: number) => void;
//   setCartTotalAmount: (totalAmount: number) => void;
// };

// export const useCartProductStore = create<State & Action>()(
//   devtools(
//     persist(
//       (set) => ({
//         cartProducts: null,
//         cartTotalQty: 0,
//         cartTotalAmount: 0,
//         addProductsToCart: (product) =>
//           set((state) => ({
//             cartProducts: state.cartProducts
//               ? [...state.cartProducts, ...product] // เพิ่ม products ลงใน cartProducts ถ้าไม่เป็น null
//               : product, // ถ้า cartProducts เป็น null ให้เริ่มต้นด้วย product
//           })),
//         handleRemoveProductFromCart: (product) =>
//           set((state) => ({
//             cartProducts: state.cartProducts
//               ? state.cartProducts.filter(
//                   (item) => item.productVariantId !== product.productVariantId
//                 ) // ลบสินค้าจาก cartProducts
//               : null, // ถ้า cartProducts เป็น null ให้ตั้งค่ากลับเป็น null
//           })),
//         handleCartQtyIncrease: (product) =>
//           set((state) => ({
//             cartProducts: state.cartProducts
//               ? state.cartProducts.map((item) =>
//                   item.productVariantId === product.productVariantId
//                     ? { ...item, quantity: item.quantity + 1 } // เพิ่ม quantity ของสินค้าที่เลือก
//                     : item
//                 )
//               : null, // ถ้า cartProducts เป็น null ให้ตั้งค่ากลับเป็น null
//           })),
//         handleCartQtyDecrease: (product) =>
//           set((state) => ({
//             cartProducts: state.cartProducts
//               ? state.cartProducts.map((item) =>
//                   item.productVariantId === product.productVariantId &&
//                   item.quantity > 1
//                     ? { ...item, quantity: item.quantity - 1 } // ลด quantity ของสินค้าที่เลือกถ้าปริมาณ > 1
//                     : item
//                 )
//               : null, // ถ้า cartProducts เป็น null ให้ตั้งค่ากลับเป็น null
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

// // // version 2
// // export const useCartProductStore = create<State & Action>()(
// //   devtools(
// //     persist(
// //       (set, get) => ({
// //         cartProducts: null,
// //         cartTotalQty: 0,
// //         cartTotalAmount: 0,

// //         // ฟังก์ชันเพิ่มสินค้าเข้า Cart
// //         addProductsToCart: (product) =>
// //           set((state) => ({
// //             cartProducts: state.cartProducts
// //               ? [...state.cartProducts, ...product] // เพิ่ม products ลงใน cartProducts ถ้าไม่เป็น null
// //               : product, // ถ้า cartProducts เป็น null ให้เริ่มต้นด้วย product
// //           })),

// //         // ฟังก์ชันเพิ่มจำนวนสินค้าใน Cart
// //         handleCartQtyIncrease: async (product: CartProductType) => {
// //           const stockAvailable = await getProductVariantStock(
// //             product.productVariantId
// //           );

// //           set((state) => {
// //             const updatedCart =
// //               state.cartProducts?.map((item) => {
// //                 if (item.productVariantId === product.productVariantId) {
// //                   if (item.quantity + 1 > stockAvailable) {
// //                     toast.error("จำนวนสินค้าไม่เพียงพอ");
// //                     return item;
// //                   }
// //                   return { ...item, quantity: item.quantity + 1 };
// //                 }
// //                 return item;
// //               }) || null;

// //             return {
// //               cartProducts: updatedCart,
// //             };
// //           });
// //         },

// //         // ฟังก์ชันลดจำนวนสินค้าใน Cart
// //         handleCartQtyDecrease: (product: CartProductType) =>
// //           set((state) => ({
// //             cartProducts: state.cartProducts
// //               ? state.cartProducts.map((item) =>
// //                   item.productVariantId === product.productVariantId &&
// //                   item.quantity > 1
// //                     ? { ...item, quantity: item.quantity - 1 }
// //                     : item
// //                 )
// //               : null,
// //           })),

// //         // ฟังก์ชันลบสินค้าออกจาก Cart
// //         handleRemoveProductFromCart: (product: CartProductType) =>
// //           set((state) => ({
// //             cartProducts: state.cartProducts
// //               ? state.cartProducts.filter(
// //                   (item) => item.productVariantId !== product.productVariantId
// //                 )
// //               : null,
// //           })),

// //         setCartTotalQty: (qty) => set({ cartTotalQty: qty }),
// //         setCartTotalAmount: (totalAmount) =>
// //           set({ cartTotalAmount: totalAmount }),
// //         clearCart: () => set({ cartProducts: null }),
// //       }),
// //       { name: "cartProducts" }
// //     )
// //   )
// // );
// import { getProductVariantStock } from "@/actions/productServices";
// import {
//   clearCart,
//   fetchCart,
//   removeProductItemFormCart,
//   updateProductItemQty,
// } from "@/services/cartServices";
// import { VariantOption } from "@/types/fetchTypes";
// import toast from "react-hot-toast";
// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// export type CartType = {
//   id: string;
//   cartItems: CartItemType[];
//   cartTotalAmount: number;
//   cartTotalQuantity: number;
// };

// export type CartItemType = {
//   // promotionType: string;
//   id: string;
//   sku: string;
//   name: string;
//   description: string;
//   image: string;
//   variantOptions?: VariantOption;
//   quantity: number;
//   unitPrice: number;
//   discount: number;
//   specialDiscount: number; //
//   productId: string;
//   promotionActivityId?: string | null;
// };

// export type State = {
//   // cart: CartItemType[] | null;
//   cart: CartType | null;
//   cartTotalQty: number;
//   cartTotalAmount: number;
// };

// export type Action = {
//   // setCart: (product: CartItemType[]) => void;
//   setCart: (cart: CartType) => void;
//   clearCart: (token: string) => void;
//   handleRemoveProductFromCart: (token: string, id: string) => void;
//   handleCartQtyIncrease: (token: string, id: string, quantity: number) => void;
//   handleCartQtyDecrease: (token: string, id: string, quantity: number) => void;
//   setCartTotalQty: (qty: number) => void;
//   setCartTotalAmount: (totalAmount: number) => void;
// };

// export const useCartServerStore = create<State & Action>()(
//   devtools(
//     persist(
//       (set) => ({
//         cart: null,
//         cartTotalQty: 0,
//         cartTotalAmount: 0,
//         setCart: (cart) => set({ cart: cart }),
//         handleRemoveProductFromCart: async (token, id) => {
//           await removeProductItemFormCart(token, id);
//           set({
//             cart: await fetchCart(token)
//               .then((res) => res.data)
//               .catch((error) => console.log(error)),
//           }); // อัปเดตตะกร้าหลังลบสินค้า
//         },
//         handleCartQtyIncrease: async (token, id, quantity) => {
//           await updateProductItemQty(token, id, quantity);
//           toast.success("test");
//           set({
//             cart: await fetchCart(token)
//               .then((res) => res.data)
//               .catch((error) => console.log(error)),
//           }); // อัปเดตตะกร้าหลังลบสินค้า
//         },
//         handleCartQtyDecrease: async (token, id, quantity) => {
//           await updateProductItemQty(token, id, quantity);
//           set({
//             cart: await fetchCart(token)
//               .then((res) => res.data)
//               .catch((error) => console.log(error)),
//           }); // อัปเดตตะกร้าหลังลบสินค้า
//         },
//         setCartTotalQty: (qty) => set({ cartTotalQty: qty }),
//         setCartTotalAmount: (totalAmount) =>
//           set({ cartTotalAmount: totalAmount }),
//         clearCart: async (token) => {
//           await clearCart(token);
//           set({
//             cart: await fetchCart(token)
//               .then((res) => res.data)
//               .catch((error) => console.log(error)),
//           }); // อัปเดตตะกร้าหลังลบสินค้า
//         },
//       }),
//       { name: "cartProducts" }
//     )
//   )
// );

// version handle error
import {
  addProductItemToCart,
  clearCart,
  fetchCart,
  removeProductItemFormCart,
  updateProductItemQty,
} from "@/services/cartServices";
import { VariantOption } from "@/types/fetchTypes";
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AxiosError } from "axios";
import { CartProductType } from "@/types/productTypes";

export type CartType = {
  id: string;
  cartItems: CartItemType[];
  cartTotalAmount: number;
  cartTotalQuantity: number;
};

export type CartItemType = {
  id: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  variantOptions?: VariantOption;
  quantity: number;
  unitPrice: number;
  discount: number;
  specialDiscount: number;
  productId: string;
  promotionActivityId?: string | null;
};

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
            const response = await updateProductItemQty(token, id, quantity);
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
            const response = await updateProductItemQty(token, id, quantity);
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

        setCartTotalQty: (qty) => set({ cartTotalQty: qty }),
        setCartTotalAmount: (totalAmount) =>
          set({ cartTotalAmount: totalAmount }),

        clearCart: async (token) => {
          try {
            const response = await clearCart(token);
            // toast.success(response?.message || "ล้างตะกร้าแล้ว");
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
