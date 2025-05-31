import {
  ChangeActiveAddressResponse,
  CreateAddressParam,
  CreateAddressResponse,
  DeleteAddressResponse,
  GetAllAddressesResponse,
  UpdateAddressParam,
  UpdateAddressResponse,
} from "@/types/addressTypes";
import axios from "axios";
import authAxios from "@/lib/authAxios";

export const createAddress = async (
  data: CreateAddressParam
): Promise<CreateAddressResponse> => {
  try {
    const response = await authAxios.post(`/addresses`, data);
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
): Promise<UpdateAddressResponse> => {
  try {
    const response = await authAxios.patch(`/addresses/${id}`, data);
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
  isDefault: boolean
): Promise<ChangeActiveAddressResponse> => {
  try {
    const response = await authAxios.patch(`/addresses/${id}`, {
      isDefault,
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
): Promise<DeleteAddressResponse> => {
  try {
    const response = await authAxios.delete(`/addresses/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบที่อยู่ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllAddresses = async (): Promise<GetAllAddressesResponse> => {
  try {
    const response = await authAxios.get(`/addresses`);
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
