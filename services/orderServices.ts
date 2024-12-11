import { CartItemType } from "@/types/cartTypes";
import { CreateOderType } from "@/types/orderTypes";
import axios from "axios";

export const createOrder = async (token: string, data: CreateOderType) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/orders`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
  }
};

export const getUserOrders = async (token: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/orders/all`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
  }
};

export const changeTrackingNumber = async (
  token: string,
  orderId: string,
  trackingNumber: string
) => {
  try {
    const { data } = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/change-trackingnumber`,
      { trackingNumber },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
  }
};

export const getOneOrder = async (id: string) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`
    );
    return data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getAllOrders = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/all`
    );
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getOrderSummaryOfGroupBuying = async (
  promotionActivityId: string | null
) => {
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/summary/today/${promotionActivityId}`
    );
    return data;
  } catch (error) {
    console.log(error);
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
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/promotion-orders/${promotionActivityId}`
    );
    console.log(response);
    // ส่งคืนผลลัพธ์
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
};

export const checkStockAndPromotionForCheckout = async (
  token: string,
  data: CartItemType[]
) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/products/variants/stock/for-checkout`,
      { orderItems: data },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error; // ส่งต่อ error ไปให้ฝั่งที่เรียกใช้ function
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

    // แสดงผลลัพธ์จาก API
    console.log("Order created successfully:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw error;
  }
}

export async function changeOrderStatus(id: string, status: string) {
  try {
    const result = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/change-status`,
      { status }
    );
    if (result) {
      window.location.reload();
    }
  } catch (error) {
    console.log(error);
  }
}

// /**
//  * ฟังก์ชันค้นหาคำสั่งซื้อจาก API
//  * @param {SearchFilters} filters - ตัวกรองสำหรับการค้นหา
//  * @returns {Promise<OrderType[]>} - รายการคำสั่งซื้อ
//  */
// export const searchOrders = async (
//   filters: SearchFilters = {}
// ): Promise<OrderType[] | undefined> => {
//   try {
//     // สร้าง URL พร้อม Query Parameters
//     const params = new URLSearchParams(
//       filters as Record<string, string>
//     ).toString();
//     const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/search?${params}`;

//     // เรียก API ด้วย axios
//     const response = await axios.get<OrderType[]>(url);

//     // ส่งคืนผลลัพธ์
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//   }
// };
// export const searchOrders = async (filters: SearchFilters = {}) => {
//   try {
//     // สร้าง URL พร้อม Query Parameters
//     const params = new URLSearchParams(
//       filters as Record<string, string>
//     ).toString();
//     const url = `${process.env.NEXT_PUBLIC_API_URL}/orders/search?${params}`;

//     // เรียก API ด้วย axios
//     const response = await axios.get(url);
//     console.log(response);
//     // ส่งคืนผลลัพธ์
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching orders:", error);
//   }
// };
