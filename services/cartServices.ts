import axios from "axios";
import { AddProductToCardParam, GetUserCartResponse } from "@/types/cartTypes";
import authAxios from "@/lib/authAxios";

export const getUserCart = async (): Promise<GetUserCartResponse> => {
  try {
    const response = await authAxios.get(`/carts/mycart`);
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

export const addProductItemToCart = async (cartItem: AddProductToCardParam) => {
  try {
    const response = await authAxios.post(`/carts/add-to-cart`, cartItem);

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
    const response = await authAxios.delete(`/carts/items/${id}`);
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
    const response = await authAxios.get(`/carts/clear-cart`);
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
    const response = await authAxios.patch(`/carts/items/${id}/qty/increase`, {
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
    const response = await authAxios.patch(`/carts/items/${id}/qty/decrease`, {
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
