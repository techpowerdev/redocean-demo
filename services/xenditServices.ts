import axios from "axios";
import authAxios from "@/lib/authAxios";
import { GetAllPayoutChannelsResponse } from "@/types/xenditTypes";

export const getAllPayoutChannels =
  async (): Promise<GetAllPayoutChannelsResponse> => {
    try {
      const response = await authAxios.get(`/xendit/payout-channels`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
      }
      throw new Error("เกิดข้อผิดพลาดบางอย่าง");
    }
  };
