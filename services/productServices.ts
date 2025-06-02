import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  CreateProductWithVariantsParams,
  CreateProductWithVariantsResponse,
  EditProductWithVariantsParams,
  EditProductWithVariantsResponse,
  GetProductItemByIdResponse,
  GetAllProductItemsResponse,
} from "@/types/productTypes";

export const createProductWithVariants = async (
  data: CreateProductWithVariantsParams
): Promise<CreateProductWithVariantsResponse> => {
  try {
    const response = await authAxios.post(`/product/items`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getProductItemById = async (
  productItemId: string
): Promise<GetProductItemByIdResponse> => {
  try {
    const response = await authAxios.get(`/product/items/${productItemId}`);
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

export const getAllProductItems =
  async (): Promise<GetAllProductItemsResponse> => {
    try {
      const response = await authAxios.get(`/product/items`);
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

export const editProductWithVariants = async (
  productItemId: string,
  data: EditProductWithVariantsParams
): Promise<EditProductWithVariantsResponse> => {
  try {
    const response = await authAxios.patch(
      `/product/items/${productItemId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteProductItem = async (
  productItemId: string
): Promise<void> => {
  try {
    const response = await authAxios.delete(`/product/items/${productItemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
