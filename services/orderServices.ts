import { CartItemType } from "@/types/cartTypes";
import {
  CreateOderType,
  CreateOrderWithPaymentIntentParams,
  CreateOrderWithPaymentIntentResponse,
  OrderType,
} from "@/types/orderTypes";
import apiClient from "@/services/apiClient";
import axios from "axios";

export async function createOrderWithPaymentIntent(
  CreateData: CreateOrderWithPaymentIntentParams
): Promise<{ data: CreateOrderWithPaymentIntentResponse; message: string }> {
  try {
    const response = await apiClient.post(`/orders`, CreateData);
    return response.data; // ดึง data จาก axios แล้วส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "สร้างรายการคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function cancelOrderAndRefund(
  orderId: string
): Promise<{ data: any; message: string }> {
  try {
    const response = await apiClient.patch(`/orders/${orderId}/cancel`);
    return response.data; // ดึง data จาก axios แล้วส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ส่งคำขอยกเลิกคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function captureOrder(
  orderId: string
): Promise<{ data: any; message: string }> {
  try {
    const response = await apiClient.post(`/orders/${orderId}/capture`);
    return response.data; // ดึง data จาก axios แล้วส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "capture ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export const createOrder = async (data: CreateOderType) => {
  try {
    const response = await apiClient.post(`/orders`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "สร้างคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getUserOrders = async () => {
  try {
    const response = await apiClient.get(`/users/orders/all`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const changeTrackingNumber = async (
  orderId: string,
  trackingNumber: string
) => {
  try {
    const response = await apiClient.patch(
      `/orders/${orderId}/change-trackingnumber`,
      { trackingNumber }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขเลข tracking no. ไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getOneOrder = async (id: string) => {
  try {
    const response = await apiClient.get(`/orders/${id}`);
    console.log("get one order === ", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllOrders = async (): Promise<{ data: OrderType[] }> => {
  try {
    const response = await apiClient.get(`/orders/all`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getOrderSummaryOfGroupBuying = async (
  promotionActivityId: string | null
) => {
  try {
    const response = await apiClient.get(
      `/orders/summary/today/${promotionActivityId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export type SearchFilters = {
  promotionId?: string;
  orderType?: string;
  status?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
};

// get order on each promotion
export const getPromotionOrder = async (promotionActivityId: string) => {
  try {
    // เรียก API ด้วย axios
    const response = await apiClient.get(
      `/orders/promotion-orders/${promotionActivityId}`
    );
    // ส่งคืนผลลัพธ์
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const checkStockAndPromotionForCheckout = async (
  data: CartItemType[]
) => {
  try {
    const response = await apiClient.post(
      `/products/variants/stock/for-checkout`,
      { cartItems: data }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "เกิดผิดพลาดเกี่ยวกับโปรโมชั่น"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

// creat fullfillment oreder
export type FulfillmentShippingAddress = {
  name: string;
  tel: string;
  address: string;
  sub_district: string;
  district: string;
  state_province: string;
  country: {
    id: number;
  };
  postcode: string;
};

export type FulfillmentShipping = {
  code: string;
  price: number;
};

export type FulfillmentDiscount = {
  type: "fixed";
  value: number;
  amount: number;
};

export type FulfillmentOrderItem = {
  code: string;
  sell_price: number;
  quantity: number;
};

export type CreateOrderFullfillmentBody = {
  items: FulfillmentOrderItem[] | [];
  shipping_address: FulfillmentShippingAddress;
  shipping: FulfillmentShipping;
  discount: FulfillmentDiscount;
  order_reference: string;
  discount_total: number;
  total: number;
  net: number;
  note: string;
  payment: {
    state: string;
    amount: number;
  };
};

export async function createOrderFullfillment(
  body: CreateOrderFullfillmentBody
) {
  try {
    // ส่ง POST request ไปยัง API
    const response = await axios.post(
      "https://ffmportal.thailandpost.com/open-api/orders/fulfillment",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AKITA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log("create fulfillment error===", error);
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "สร้างคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function changeOrderStatus(id: string, status: string) {
  try {
    const response = await apiClient.patch(`/orders/${id}/change-status`, {
      status,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขสถานะคำสั่งซื้อไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
