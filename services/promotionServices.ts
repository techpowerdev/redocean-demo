import axios from "axios";
import apiClient from "./apiClient";
import {
  AddPromotionResponse,
  ChangePromotionStatusResponse,
  GetAllPromotionsResponse,
  GetPromotionByIdResponse,
  GetPromotionTodayResponse,
  GetUpcomingPromotionResponse,
  UpdatePromotionResponse,
} from "@/types/promotionTypes";

export const getPromotionToday =
  async (): Promise<GetPromotionTodayResponse> => {
    try {
      const response = await apiClient.get(`/promotions/today`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "ไม่สามารถดึงข้อมูลโปรโมชั่นได้"
        );
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

export const getUpcomingPromotion =
  async (): Promise<GetUpcomingPromotionResponse> => {
    try {
      const response = await apiClient.get(`/promotions/upcoming`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "ไม่สามารถดึงข้อมูลโปรโมชั่นได้"
        );
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

export const addPromotion = async (
  formData: FormData
): Promise<AddPromotionResponse> => {
  try {
    const response = await apiClient.post(`/promotions`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "เพิ่มโปรโมชั่นไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllPromotions = async (): Promise<GetAllPromotionsResponse> => {
  try {
    const response = await apiClient.get(`/promotions/all`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ไม่สามารถดึงข้อมูลโปรโมชั่นได้"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getPromotionById = async (
  promotionId: string
): Promise<GetPromotionByIdResponse> => {
  try {
    const response = await apiClient.get(`/promotions/${promotionId}`);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ไม่สามารถดึงข้อมูลโปรโมชั่นได้"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updatePromotion = async (
  id: string,
  formData: FormData
): Promise<UpdatePromotionResponse> => {
  try {
    const response = await apiClient.put(`/promotions/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขโปรโมชั่นไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const changePromotionStatus = async (
  id: string,
  status: boolean
): Promise<ChangePromotionStatusResponse> => {
  try {
    const response = await apiClient.patch(`/promotions/change-status/${id}`, {
      isActive: status,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขสถานะโปรโมชั่นไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deletePromotion = async (promotionId: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/promotions/${promotionId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ไม่สามารถลบโปรโมชั่นได้"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
