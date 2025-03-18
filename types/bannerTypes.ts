import { Banner } from "@/types/baseTypes";

export type GetAllBannersResponse = {
  data: Banner[];
};

export type UpdateBannerOrderType = {
  id: string;
  order: number;
};
