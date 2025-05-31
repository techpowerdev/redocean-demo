import { PromotionActivity } from "@/types/baseTypes";

export type CreatePromotionActivityParams = {
  promotionId: string;
  productItemId: string;
  discountType: string;
  discountAmount: number;
  limitQuantity: boolean;
  maxQuantity: number | null;
  limitQuantityPerUser: boolean;
  maxQuantityPerUser: number | null;
  minimumPurchaseQuantity: number | null;
};

export type CreatePromotionActivityResponse = {
  data: PromotionActivity;
};

export type GetAllPromotionActivitiesResponse = {
  data: PromotionActivity[];
};

export type GetPromotionActivityByIdResponse = {
  data: PromotionActivity;
};

export type GetProductPromotionActivityResponse = {
  data: PromotionActivity;
};

export type UpdateCreatePromotionActivityParams =
  Partial<CreatePromotionActivityParams>;

export type UpdatePromotionActivityResponse = {
  data: PromotionActivity;
};
