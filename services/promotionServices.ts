import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  CreatePromotionParams,
  CreatePromotionResponse,
  GetAllPromotionsResponse,
  GetPromotionByIdResponse,
  UpdatePromotionParams,
  UpdatePromotionResponse,
} from "@/types/promotionTypes";
import publicAxios from "@/lib/publicAxios";

export const createPromotion = async (
  data: CreatePromotionParams
): Promise<CreatePromotionResponse> => {
  try {
    const response = await authAxios.post(`/promotions`, data);
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

export type PromotionFilter = "today" | "upcoming" | "all";

export const getPromotions = async (
  filter: PromotionFilter
): Promise<GetAllPromotionsResponse> => {
  try {
    const response = await publicAxios.get<GetAllPromotionsResponse>(
      `/promotions/?filter=${filter}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ไม่สามารถดึงข้อมูลโปรโมชั่นได้"
      );
    }
    throw new Error("เกิดข้อผิดพลาดที่ไม่คาดคิด");
  }
};

export const getPromotionById = async (
  promotionId: string
): Promise<GetPromotionByIdResponse> => {
  try {
    const response = await authAxios.get(`/promotions/${promotionId}`);

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
  data: UpdatePromotionParams
): Promise<UpdatePromotionResponse> => {
  try {
    const response = await authAxios.patch(`/promotions/${id}`, data);
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

export const deletePromotion = async (promotionId: string): Promise<void> => {
  try {
    const response = await authAxios.delete(`/promotions/${promotionId}`);
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
