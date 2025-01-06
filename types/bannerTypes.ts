import { ImageType } from "./imageTypes";

// types based on the prisma schema
export type BannerType = {
  id: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;

  imageId: string;

  image?: ImageType | null;
};
// end of types based on the prisma schema

// types for the client side
export type FetchAllBannersResponseType = {
  message?: string | null;
  data: BannerType[];
};

export type UpdateBannerOrderType = {
  id: string;
  order: number;
};
