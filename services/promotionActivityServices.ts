import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  CreatePromotionActivityResponse,
  CreatePromotionActivityParams,
  GetPromotionActivityByIdResponse,
  UpdatePromotionActivityResponse,
  UpdateCreatePromotionActivityParams,
  GetAllPromotionActivitiesResponse,
  GetProductPromotionActivityResponse,
} from "@/types/promotionActivityTypes";

export const createPromotionActivity = async (
  data: CreatePromotionActivityParams
): Promise<CreatePromotionActivityResponse> => {
  try {
    const response = await authAxios.post(`/promotion-activities`, data);
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

export const getProductPromotionActivity = async (
  promotionId: string,
  productItemId: string
): Promise<GetProductPromotionActivityResponse> => {
  try {
    const response = await authAxios.get(
      `/promotion-activities/search/q?promotionId=${promotionId}&productItemId=${productItemId}`
    );

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

export const getPromotionActivityById = async (
  promotionId: string
): Promise<GetPromotionActivityByIdResponse> => {
  try {
    const response = await authAxios.get(
      `/promotion-activities/${promotionId}`
    );

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

export const updatePromotionActivity = async (
  id: string,
  data: UpdateCreatePromotionActivityParams
): Promise<UpdatePromotionActivityResponse> => {
  try {
    const response = await authAxios.patch(`/promotion-activities/${id}`, data);
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

export const deletePromotionActivity = async (
  promotionId: string
): Promise<void> => {
  try {
    const response = await authAxios.delete(
      `/promotion-activities/${promotionId}`
    );
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
