import axios from "axios";
import apiClient from "./apiClient";
import {
  StripeCreatePaymentIntentResultType,
  StripeCreatePaymentIntentForOneProductType,
} from "@/types/stripeTypes";

export async function StripeCreatePaymentIntentForOneProduct(
  CreatePaymentIntentData: StripeCreatePaymentIntentForOneProductType
): Promise<{ data: StripeCreatePaymentIntentResultType; message: string }> {
  try {
    const response = await apiClient.post(
      `/stripe/payment_intents`,
      CreatePaymentIntentData
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
