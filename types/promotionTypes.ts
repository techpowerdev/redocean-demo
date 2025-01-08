import { CartItemType } from "./cartTypes";
import { ImageType } from "./imageTypes";
import { OrderItemType } from "./orderTypes";
import { ProductType } from "./productTypes";

// types based on the prisma schema
export type PromotionType = {
  id: string;
  type: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  promotionActivities?: PromotionActivityType[] | null;
  images?: ImageType[] | null;
};

export type PromotionActivityType = {
  id: string;
  discountType: string;
  discountAmount: number;
  limitQuantity: boolean;
  maxQuantity?: number | null;
  limitQuantityPerUser: boolean;
  maxQuantityPerUser?: number | null;
  minimumPurchaseQuantity?: number | null;
  // discountGroupAmount?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  promotionId: string;
  productId: string;

  promotion?: PromotionType | null;
  product?: ProductType | null;
  cartItems?: CartItemType[] | null;
  orderItems?: OrderItemType[] | null;
};

// end of types based on the prisma schema

// types for the client side
export type FetchAllPromotionResponseType = {
  message?: string;
  data: PromotionType[];
};

export type FetchOnePromotionResponseType = {
  message?: string;
  data: PromotionType;
};
