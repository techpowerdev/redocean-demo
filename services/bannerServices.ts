import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  CreateManyBannerParams,
  CreateManyBannerResponse,
  GetAllBannersResponse,
  UpdateManyBannerParams,
  UpdateManyBannerResponse,
} from "@/types/bannerTypes";
import publicAxios from "@/lib/publicAxios";

export const createBanner = async (
  data: CreateManyBannerParams
): Promise<CreateManyBannerResponse> => {
  try {
    const response = await authAxios.post(`/banners/bulk`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "เพิ่มแบนเนอร์ไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllBanners = async (): Promise<GetAllBannersResponse> => {
  try {
    const response = await authAxios.get(`/banners`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงรูปภาพแบนเนอร์ไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateBannerOrder = async (
  data: UpdateManyBannerParams
): Promise<UpdateManyBannerResponse> => {
  try {
    const response = await authAxios.patch(`/banners/update/bulk`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขแบนเนอร์ไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteBanner = async (bannerId: string): Promise<void> => {
  try {
    const response = await authAxios.delete(`/banners/${bannerId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบแบนเนอร์ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
