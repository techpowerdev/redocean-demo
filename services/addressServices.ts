import {
  CreateAddressParam,
  CreateAddressResponse,
  UpdateAddressParam,
  UpdateAddressResponse,
} from "@/types/addressTypes";
import axios from "axios";
import apiClient from "./apiClient";
import { Address } from "@/types/baseTypes";

export const createAddress = async (
  data: CreateAddressParam
): Promise<{ data: CreateAddressResponse; message: string }> => {
  try {
    const response = await apiClient.post(`/addresses`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มที่อยู่ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateAddress = async (
  id: string,
  data: UpdateAddressParam
): Promise<{ data: UpdateAddressResponse; message: string }> => {
  try {
    const response = await apiClient.put(`/addresses/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขที่อยู่ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const changeActiveAddress = async (
  id: string,
  isActive: boolean
): Promise<{
  data: Address;
  message: string;
}> => {
  try {
    const response = await apiClient.patch(`/addresses/${id}`, {
      isActive,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขที่อยู่หลักไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteAddress = async (
  id: string
): Promise<{ data: Address; message: string }> => {
  try {
    const response = await apiClient.delete(`/addresses/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบที่อยู่ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAddress = async (): Promise<{
  data: Address[];
  message: string;
}> => {
  try {
    const response = await apiClient.get(`/addresses`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลที่อยู่ไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
