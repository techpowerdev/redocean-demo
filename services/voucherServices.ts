import {
  BuyVoucherParams,
  CreateOrderVoucherWithPaymentIntentParams,
  CreateOrderVoucherWithPaymentIntentResponse,
  CreateVoucherGroupWithVouchersParams,
  GetAllVoucherGroupsForSellResponse,
  GetAllVoucherGroupsResponse,
  GetVoucherGroupByIdForSellResponse,
  GetVoucherGroupByIdResponse,
  UpdateVoucherGroupWithVouchersParams,
} from "@/types/voucherTypes";
import authAxios from "@/lib/authAxios";
import axios from "axios";
import publicAxios from "@/lib/publicAxios";

export const createVoucherGroupWithVouchers = async (
  data: CreateVoucherGroupWithVouchersParams
): Promise<void> => {
  try {
    const response = await authAxios.post(
      `/voucher-groups/with-vouchers`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllVoucherGroups =
  async (): Promise<GetAllVoucherGroupsResponse> => {
    try {
      const response = await authAxios.get(`/voucher-groups`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

export const getVoucherGroupById = async (
  id: string
): Promise<GetVoucherGroupByIdResponse> => {
  try {
    const response = await authAxios.get(`/voucher-groups/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteVoucherGroup = async (id: string): Promise<void> => {
  try {
    const response = await authAxios.delete(`/voucher-groups/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateVoucherGroupWithVouchers = async (
  id: string,
  data: UpdateVoucherGroupWithVouchersParams
): Promise<void> => {
  try {
    const response = await authAxios.patch(
      `/voucher-groups/with-vouchers/${id}`,
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

export const getAllVoucherGroupsForSell =
  async (): Promise<GetAllVoucherGroupsForSellResponse> => {
    try {
      const response = await publicAxios.get(`/voucher-groups/for-sell/all`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

export const getVoucherGroupByIdForSell = async (
  id: string
): Promise<GetVoucherGroupByIdForSellResponse> => {
  try {
    const response = await authAxios.get(`/voucher-groups/for-sell/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteVoucher = async (id: string): Promise<void> => {
  try {
    const response = await authAxios.delete(`/vouchers/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const buyVoucher = async (
  data: CreateOrderVoucherWithPaymentIntentParams
): Promise<CreateOrderVoucherWithPaymentIntentResponse> => {
  try {
    const response = await authAxios.post(`/vouchers/buy`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
