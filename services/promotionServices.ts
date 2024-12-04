import { PromotionType } from "@/types/fetchTypes";
import axios, { AxiosResponse } from "axios";

export const getPromotionToday = async (): Promise<AxiosResponse<
  PromotionType[]
> | null> => {
  try {
    const result = await axios.get<PromotionType[]>(
      `${process.env.NEXT_PUBLIC_API_URL}/promotions/today`
    );
    return result;
  } catch (error) {
    console.error("Error fetching today's promotions:", error);
    // Return an empty array to ensure the function always returns PromotionType[]
    return null;
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
