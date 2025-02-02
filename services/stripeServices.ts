import axios from "axios";
import apiClient from "./apiClient";
import {
  StripeCreatePaymentIntentResultType,
  StripeCreatePaymentIntentForOneProductType,
  StripeCreatePaymentIntentForCartProductsType,
  StripeCreatePaymentIntentType,
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

export async function StripeCreatePaymentIntent(
  CreatePaymentIntentData: StripeCreatePaymentIntentType
): Promise<{ data: StripeCreatePaymentIntentResultType; message: string }> {
  try {
    const response = await apiClient.post(
      // `/stripe/payment_intents`,
      `/orders`,
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

export async function StripeCreatePaymentIntentForOneProduct(
  CreatePaymentIntentData: StripeCreatePaymentIntentForOneProductType
): Promise<{ data: StripeCreatePaymentIntentResultType; message: string }> {
  try {
    const response = await apiClient.post(
      `/stripe/payment_intents/for-one-product`,
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

export async function StripeCreatePaymentIntentForCartProduct(
  CreatePaymentIntentData: StripeCreatePaymentIntentForCartProductsType
): Promise<{ data: StripeCreatePaymentIntentResultType; message: string }> {
  try {
    const response = await apiClient.post(
      `/stripe/payment_intents/for-cart-products`,
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
