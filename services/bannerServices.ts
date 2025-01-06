import axios from "axios";
import apiClient from "./apiClient";
import { UpdateBannerOrderType } from "@/types/bannerTypes";

export const getAllBanners = async () => {
  try {
    const response = await apiClient.get(`/banners/all`);
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

export const createBanner = async (formData: FormData) => {
  try {
    const response = await apiClient.post(`/banners`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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

export const updateBannerOrder = async (banners: UpdateBannerOrderType[]) => {
  try {
    const response = await apiClient.put(`/banners`, { banners });
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

export const deleteBanner = async (bannerId: string) => {
  try {
    const response = await apiClient.delete(`/banners/${bannerId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบแบนเนอร์ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
