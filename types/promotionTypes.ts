import { Image, Promotion, PromotionActivity } from "@/types/baseTypes";

export type PromotionWithImageAndPromotionActivity = Promotion & {
  images: Image[];
  promotionActivities: PromotionActivity[];
};

export type GetPromotionTodayResponse = {
  data: PromotionWithImageAndPromotionActivity[];
};

export type GetUpcomingPromotionResponse = {
  data: PromotionWithImageAndPromotionActivity[];
};
