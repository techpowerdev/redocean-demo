import { PromotionType } from "@/types/fetchTypes";
import axios, { AxiosResponse } from "axios";
import apiClient from "./apiClient";

export const getPromotionToday = async () => {
  try {
    const result = await apiClient.get(`/promotions/today`);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ไม่สามารถดึงข้อมูลโปรโมชั่นได้"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getPromotionById = async (promotionId: string) => {
  try {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/${promotionId}`
    );
    console.log(result);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const deletePromotion = async (
  promotionId: string
): Promise<AxiosResponse<PromotionType> | null> => {
  try {
    const result = await axios.delete<PromotionType>(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/${promotionId}`
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};
