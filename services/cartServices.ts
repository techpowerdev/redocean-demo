import { CartProductType } from "@/types/productTypes";
import axios from "axios";

export const fetchCart = async (token: string) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/carts`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch cart:", error);
  }
};

export const addProductItemToCart = async (
  token: string,
  cartItem: CartProductType
) => {
  try {
    const result = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/carts`,
      cartItem,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result.data);
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

export const removeProductItemFormCart = async (token: string, id: string) => {
  try {
    const result = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/users/carts/items/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result);
    return result.data;
  } catch (error) {
    console.error("Error deleting product item from cart:", error);
  }
};
export const clearCart = async (token: string) => {
  try {
    const result = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/users/carts`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result);
    return result.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};

export const increaseProductItemQty = async (
  token: string,
  id: string,
  quantity: number
) => {
  try {
    const result = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/carts/items/${id}/qty/increase`,
      { quantity },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Error updating product item from cart:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
  }
};

export const decreaseProductItemQty = async (
  token: string,
  id: string,
  quantity: number
) => {
  try {
    const result = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/carts/items/${id}/qty/decrease`,
      { quantity },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Error updating product item from cart:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
  }
};
