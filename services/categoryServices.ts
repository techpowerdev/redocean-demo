import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  CreateCategoryParams,
  CreateCategoryResponse,
  GetCategoryByIdResponse,
  GetAllCategoriesResponse,
  UpdateCategoryParams,
  UpdateCategoryResponse,
} from "@/types/categoryTypes";

export const createCategory = async (
  data: CreateCategoryParams
): Promise<CreateCategoryResponse> => {
  try {
    const response = await authAxios.post(`/product/categories`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllCategories = async (): Promise<GetAllCategoriesResponse> => {
  try {
    const response = await authAxios.get(`/product/categories`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลหมวดหมู่สินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getCategoryById = async (
  categoryId: string
): Promise<GetCategoryByIdResponse> => {
  try {
    const response = await authAxios.get(`/product/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลหมวดหมู่สินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateCategory = async (
  categoryId: string,
  data: UpdateCategoryParams
): Promise<UpdateCategoryResponse> => {
  try {
    const response = await authAxios.patch(
      `/product/categories/${categoryId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteCategory = async (categoryId: string): Promise<void> => {
  try {
    const response = await authAxios.delete(
      `/product/categories/${categoryId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
