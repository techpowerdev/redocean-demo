import { Banner } from "@/types/baseTypes";

export type GetAllBannersResponse = { data: Banner[] };
export type CreateBannerResponse = { data: Banner };

export type UpdateBannerOrderParam = {
  banners: {
    id: string;
    imageId: string;
    sortOrder?: number;
  }[];
};

export type UpdateBannerOrderResponse = { data: Banner[] };

// version 2
export type CreateBannerParams = {
  imageId?: string;
  sortOrder?: number;
};

export type CreateManyBannerParams = {
  banners: CreateBannerParams[];
};

export type CreateManyBannerResponse = {
  data: BannerResponse[];
};

export type UpdateBannerParams = {
  id: string;
  imageId?: string;
  sortOrder?: number;
};

export type UpdateManyBannerParams = {
  banners: UpdateBannerParams[];
};

export type BannerResponse = {
  id: string;
  sortOrder: number;
  image?: {
    id: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type UpdateManyBannerResponse = {
  data: BannerResponse[];
};
