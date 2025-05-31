import { GetProductModelByIdResponse } from "@/types/productModelTypes";
import authAxios from "@/lib/authAxios";
import axios from "axios";

export const getProductModelById = async (
  productModelId: string
): Promise<GetProductModelByIdResponse> => {
  try {
    const response = await authAxios.get(`/product/models/${productModelId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
