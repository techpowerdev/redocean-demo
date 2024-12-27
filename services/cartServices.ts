import { CartProductType } from "@/types/productTypes";
import axios from "axios";
import apiClient from "@/services/apiClient";

export const fetchCart = async () => {
  try {
    const response = await apiClient.get(`/users/carts`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
  }
};

export const addProductItemToCart = async (cartItem: CartProductType) => {
  try {
    const result = await apiClient.post(`/users/carts`, cartItem);

    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
  }
};

export const removeProductItemFormCart = async (id: string) => {
  try {
    const result = await apiClient.delete(`/users/carts/items/${id}`);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
export const clearCart = async () => {
  try {
    const result = await apiClient.delete(`/users/carts`);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};

// export const increaseProductItemQty = async (id: string, quantity: number) => {
//   try {
//     const result = await apiClient.patch(
//       `/users/carts/items/${id}/qty/increase`,
//       { quantity }
//     );
//     return result.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       console.error("Axios error :", error);
//       console.error("Axios error details:", error.response?.data);
//     } else {
//       console.error("Unexpected error:", error);
//     }
//     throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
//   }
// };
export const increaseProductItemQty = async (id: string, quantity: number) => {
  try {
    const result = await apiClient.patch(
      `/users/carts/items/${id}/qty/increase`,
      { quantity }
    );
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มจำนวนไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const decreaseProductItemQty = async (id: string, quantity: number) => {
  try {
    const result = await apiClient.patch(
      `/users/carts/items/${id}/qty/decrease`,
      { quantity }
    );
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
};
