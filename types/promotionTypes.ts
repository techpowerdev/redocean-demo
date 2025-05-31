import { Promotion } from "@/types/baseTypes";

export type CreatePromotionParams = {
  name: string;
  description: string;
  type: string;
  startAt: string;
  endAt: string;
  imageIds: string[];
  isActive?: boolean;
};

export type CreatePromotionResponse = {
  data: Promotion;
};

export type GetAllPromotionsResponse = {
  data: Promotion[];
};

export type GetPromotionByIdResponse = {
  data: Promotion;
};

export type UpdatePromotionParams = Partial<CreatePromotionParams>;

export type UpdatePromotionResponse = {
  data: Promotion;
};
