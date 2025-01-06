import { BannerType } from "./bannerTypes";
import { PromotionType } from "./promotionTypes";

// types based on the prisma schema
export type ImageType = {
  id: string;
  url: string;
  tag?: string | null;
  createdAt: Date;
  updatedAt: Date;

  promotionId?: string | null;
  bannerId?: string | null;

  promotion?: PromotionType | null;
  banner?: BannerType | null;
};
// end of types based on the prisma schema

// types for the client side
export type FetchAllImagesResponseType = {
  message?: string;
  data: ImageType[];
};
