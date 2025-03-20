import { Cart } from "@/types/baseTypes";

export type GetUserCartResponse = {
  message?: string | null;
  data: Cart & {
    cartTotalAmount: number;
    cartTotalQuantity: number;
  };
};

export type CartProduct = Cart & {
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
