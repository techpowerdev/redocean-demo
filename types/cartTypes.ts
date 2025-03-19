import { User, Product, PromotionActivity } from "@/types/baseTypes";

// types based on the prisma schema
export type CartType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  userId: string;

  user?: User | null;
  cartItems?: CartItemType[] | null;

  // return from backend process
  // cartTotalAmount: number;
  // cartTotalQuantity: number;
};

export type CartItemType = {
  id: string;
  sku: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  cartId: string;
  productId: string;
  promotionActivityId?: string | null;

  cart?: CartType | null;
  product?: Product | null;
  promotionActivity?: PromotionActivity | null;
  promotionType?: string | null;

  // return from backend process
  unitPrice: number;
  discount?: number | null;
  variantOptions?: string | null;
  name: string | null;
  description: string;
  image?: string | null;
  warningMessage: string;
};

// end of types based on the prisma schema

// types for the client side
export type GetUserCartResponse = {
  message?: string | null;
  data: CartType & {
    cartTotalAmount: number;
    cartTotalQuantity: number;
  };
};

export type CartProductType = CartType & {
  cartTotalAmount: number;
  cartTotalQuantity: number;
};

export type AddProductToCardParam = {
  productId: string;
  sku: string;
  quantity: number;
  promotionActivityId?: string | null;
  promotionType?: string | null;
};
