import axios from "axios";
import apiClient from "./apiClient";
import {
  CreatePaymentIntentResponse,
  CreatePaymentIntentParam,
} from "@/types/stripeTypes";

export async function createPaymentIntent(
  CreateData: CreatePaymentIntentParam
): Promise<{ data: CreatePaymentIntentResponse; message: string }> {
  try {
    const response = await apiClient.post(
      `/stripe/payment_intents`,
      CreateData
    );
    console.log("response==>", response.data);
    return response.data; // ดึง data จาก axios แล้วส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "สร้างรายการชำระเงินไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function getPaymentIntentById(
  paymentIntentId: string
): Promise<{ data: any }> {
  try {
    const response = await apiClient.get(
      `/stripe/payment_intents/${paymentIntentId}`
    );
    console.log("get payment intent==>", response.data);
    return response.data; // ดึง data จาก axios แล้วส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "สร้างรายการชำระเงินไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
