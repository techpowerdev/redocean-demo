import { Banner } from "@/types/baseTypes";

export type GetAllBannersResponse = { data: Banner[] };
export type CreateBannerResponse = { data: Banner };

export type UpdateBannerOrderParam = {
  id: string;
  order: number;
};

export type UpdateBannerOrderResponse = { data: Banner[] };
