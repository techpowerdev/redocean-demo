import axios from "axios";
import apiClient from "@/services/apiClient";
import { AddProductToCardInputType } from "@/types/cartTypes";

export const getUserCart = async () => {
  try {
    const response = await apiClient.get(`/carts`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลตะกร้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const addProductItemToCart = async (
  cartItem: AddProductToCardInputType
) => {
  try {
    const response = await apiClient.post(`/carts`, cartItem);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "เพิ่มสินค้าลงตะกร้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const removeProductItemFormCart = async (id: string) => {
  try {
    const response = await apiClient.delete(`/carts/items/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ลบสินค้าออกจากตะกร้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
export const clearCart = async () => {
  try {
    const response = await apiClient.delete(`/carts`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ล้างตะกร้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const increaseProductItemQty = async (id: string, quantity: number) => {
  try {
    const response = await apiClient.patch(`/carts/items/${id}/qty/increase`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มจำนวนไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const decreaseProductItemQty = async (id: string, quantity: number) => {
  try {
    const response = await apiClient.patch(`/carts/items/${id}/qty/decrease`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลดจำนวนไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
