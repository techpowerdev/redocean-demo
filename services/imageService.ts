import axios from "axios";
import authAxios from "@/lib/authAxios";
import { Image } from "@/types/baseTypes";

export const getAllImages = async (): Promise<{ data: Image[] }> => {
  try {
    const response = await authAxios.get(`/images`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงรูปภาพไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const uploadSingleImage = async (
  file: File,
  tag?: string
): Promise<{ data: Image }> => {
  try {
    const formData = new FormData();
    formData.append("file", file); // เพิ่มไฟล์ใน FormData
    tag && formData.append("tag", tag); // ส่ง tag ไปพร้อมรูป

    const response = await authAxios.post(`/images/single`, formData, {
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

export const uploadImage = async (
  formData: FormData
): Promise<{ data: Image }> => {
  try {
    const response = await authAxios.post(`/images`, formData, {
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
    const response = await authAxios.patch(`/images/${imageId}`, { tag });
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

export const deleteImage = async (imageId: string): Promise<void> => {
  try {
    const response = await authAxios.delete(`/images/single/${imageId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบรูปภาพไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteImages = async (imageIds: string[]): Promise<void> => {
  try {
    const response = await authAxios.delete(`/images/multiple`, {
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
