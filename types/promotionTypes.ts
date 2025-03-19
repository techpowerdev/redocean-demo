import { Promotion } from "@/types/baseTypes";

export type GetPromotionTodayResponse = {
  data: Promotion[];
};

export type GetUpcomingPromotionResponse = {
  data: Promotion[];
};

export type GetPromotionByIdResponse = {
  data: Promotion;
};

export type AddPromotionResponse = {
  data: Promotion;
};

export type GetAllPromotionsResponse = {
  data: Promotion[];
};

export type UpdatePromotionResponse = {
  data: Promotion;
};

export type ChangePromotionStatusResponse = {
  data: Promotion;
};
