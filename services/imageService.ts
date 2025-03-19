import axios from "axios";
import apiClient from "./apiClient";
import { Image } from "@/types/baseTypes";

export const getAllImages = async (): Promise<{ data: Image[] }> => {
  try {
    const response = await apiClient.get(`/images/all`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงรูปภาพไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const uploadImage = async (
  formData: FormData
): Promise<{ data: Image }> => {
  try {
    const response = await apiClient.post(`/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "อัปโหลดรูปภาพไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateImage = async (
  imageId: string,
  tag: string
): Promise<{ data: Image }> => {
  try {
    const response = await apiClient.put(
      `/images/${imageId}`,
      { tag },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขแท็กรูปภาพไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteImages = async (imageIds: string[]): Promise<void> => {
  try {
    const response = await apiClient.delete(`/images`, {
      data: { ids: imageIds },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบรูปภาพไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/images/${imageId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบรูปภาพไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
