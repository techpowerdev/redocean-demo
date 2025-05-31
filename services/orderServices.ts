import {
  // CreateOder,
  CreateOrderWithPaymentIntentParams,
  CreateOrderWithPaymentIntentResponse,
  GetAllOrdersResponse,
  GetOneOrderResponse,
  GetOrderVouchersOfUserParams,
  GetOrderVouchersOfUserResponse,
  // GetOrderSummaryOfGroupBuyingResponse,
  // GetPromotionOrderResponse,
  GetPromotionOrderSummaryResponse,
  GetUserOrdersResponse,
  SummaryOrderBeforeCheckoutParams,
  SummaryOrderBeforeCheckoutResponse,
} from "@/types/orderTypes";
import authAxios from "@/lib/authAxios";
import axios from "axios";
import { CartItem } from "@/types/baseTypes";

export async function summaryOrderBeforeCheckout(
  CreateData: SummaryOrderBeforeCheckoutParams
): Promise<SummaryOrderBeforeCheckoutResponse> {
  try {
    const response = await authAxios.post(`/orders/validate`, CreateData);
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

export async function createOrderWithPaymentIntent(
  CreateData: CreateOrderWithPaymentIntentParams
): Promise<CreateOrderWithPaymentIntentResponse> {
  try {
    const response = await authAxios.post(`/orders`, CreateData);
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
    const response = await authAxios.patch(`/orders/${orderId}/cancel`);
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
    const response = await authAxios.post(`/orders/${orderId}/capture`);
    return response.data; // ดึง data จาก axios แล้วส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "capture ไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

// export const createOrder = async (data: CreateOder) => {
//   try {
//     const response = await authAxios.post(`/orders`, data);
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(
//         error.response?.data?.message || "สร้างคำสั่งซื้อไม่สำเร็จ"
//       );
//     }
//     throw new Error("เกิดข้อผิดพลาดบางอย่าง");
//   }
// };

export const getUserOrders = async (): Promise<GetUserOrdersResponse> => {
  try {
    const response = await authAxios.get(`/users/orders`);
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

export const getOrderVouchersOfUser = async (
  data: GetOrderVouchersOfUserParams
): Promise<GetOrderVouchersOfUserResponse> => {
  try {
    const response = await authAxios.post(`/users/orders/order-vouchers`, data);
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
): Promise<void> => {
  try {
    const response = await authAxios.patch(`/orders/${orderId}`, {
      trackingNumber,
    });
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

export const getOneOrder = async (id: string): Promise<GetOneOrderResponse> => {
  try {
    const response = await authAxios.get(`/orders/${id}`);
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

export const getAllOrders = async (): Promise<GetAllOrdersResponse> => {
  try {
    const response = await authAxios.get(`/orders`);
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

export const getPromotionOrderSummary = async (
  promotionActivityId: string
): Promise<GetPromotionOrderSummaryResponse> => {
  try {
    const response = await authAxios.get(
      `/orders/promotion-orders/${promotionActivityId}`
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
// export const getPromotionOrder = async (
//   promotionActivityId: string
// ): Promise<GetPromotionOrderResponse> => {
//   try {
//     // เรียก API ด้วย axios
//     const response = await authAxios.get(
//       `/orders/promotion-orders/${promotionActivityId}`
//     );
//     // ส่งคืนผลลัพธ์
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       throw new Error(error.response?.data?.message || "ดึงข้อมูลไม่สำเร็จ");
//     }
//     throw new Error("เกิดข้อผิดพลาดบางอย่าง");
//   }
// };

export const checkStockAndPromotionForCheckout = async (data: CartItem[]) => {
  try {
    const response = await authAxios.post(
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
    const response = await authAxios.patch(`/orders/${id}`, {
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
