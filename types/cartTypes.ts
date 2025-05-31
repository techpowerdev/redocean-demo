import {
  Cart,
  CartItem,
  ProductItem,
  ProductModel,
  Promotion,
  PromotionActivity,
} from "@/types/baseTypes";

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
  productItemId: string;
  productModelId: string;
  quantity: number;
  promotionId?: string | null;
  promotionType?: string | null;
  promotionActivityId?: string | null;
};
