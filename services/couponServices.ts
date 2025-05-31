import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  CreateCouponParams,
  CreateCouponResponse,
  GetCouponByIdResponse,
  GetAllCouponsResponse,
  UpdateCouponParams,
  UpdateCouponResponse,
  ValidateCouponParams,
  ValidateCouponResponse,
} from "@/types/couponTypes";

export const createCoupon = async (
  data: CreateCouponParams
): Promise<CreateCouponResponse> => {
  try {
    const response = await authAxios.post(`/coupons`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มคูปองไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllCoupons = async (): Promise<GetAllCouponsResponse> => {
  try {
    const response = await authAxios.get(`/coupons`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลคูปองไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getCouponById = async (
  couponId: string
): Promise<GetCouponByIdResponse> => {
  try {
    const response = await authAxios.get(`/coupons/${couponId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลคูปองไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const validateCoupon = async (
  data: ValidateCouponParams
): Promise<ValidateCouponResponse> => {
  try {
    const response = await authAxios.post(`/coupons/validate`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "เกิดข้อผิดพลาดระหว่างการตรวจสอบคูปอง"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateCoupon = async (
  couponId: string,
  data: UpdateCouponParams[]
): Promise<UpdateCouponResponse> => {
  try {
    const response = await authAxios.patch(`/coupons/${couponId}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteCoupon = async (couponId: string): Promise<void> => {
  try {
    const response = await authAxios.delete(`/coupons/${couponId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
