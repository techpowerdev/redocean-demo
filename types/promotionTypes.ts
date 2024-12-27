import { ImageType } from "./imageTypes";
import { ProductType } from "./productTypes";

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

  promotionActivities: PromotionActivityType[];
  images: ImageType[];
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
  discountGroupAmount?: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  promotionId: string;
  productId: string;
  product: ProductType;
};
