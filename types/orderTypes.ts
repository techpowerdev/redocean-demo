import { ShippingAddress } from "./addressTypes";
import {
  Order,
  OrderItem,
  OrderVoucher,
  ProductModel,
} from "@/types/baseTypes";

export type CreateOrderItem = {
  productItemId: string;
  productModelId: string;
  quantity: number;
  promotionType?: string | null;
  promotionId?: string | null;
  promotionActivityId?: string | null;
};

export type PaymentState = "initial_payment" | "additional_payment";

export type PriceInfo = {
  unitPrice: number;
  discount: number;
  discountedPrice: number;
  totalDiscount: number;
  totalAmount: number;
  netAmount: number;
};

export type ValidatedOrderItem = {
  productItemId: string;
  productModelId: string;
  quantity: number;
  promotionId: string | null;
  promotionType: string | null;
  promotionActivityId: string | null;
  priceInfo: PriceInfo;
  productModelItem: ProductModel;
  status: string;
  warningMessage: string | null;
};

export type OrderSummary = {
  couponId?: string | null;
  items: ValidatedOrderItem[];
  totalAmount: number;
  totalDiscount: number;
  netAmount: number;
  totalQuantity: number;
  nextProcess: boolean;
};

export type SummaryOrderBeforeCheckoutParams = {
  items: CreateOrderItem[];
};

export type SummaryOrderBeforeCheckoutResponse = {
  data: OrderSummary;
};

// ลงท้ายด้วย param/params หากเป็น type ของ input ใน function
export interface CreateOrderWithPaymentIntentParams {
  couponCode?: string | null;
  items: CreateOrderItem[];
  shippingAddress: ShippingAddress;
  currency?: string;
  captureLater?: boolean;
  paymentState?: PaymentState;
}

export type OrderWithPaymentIntent = OrderSummary & {
  // กรณี validate ไม่ผ่าน จะไม่เกิดการสร้าง order และไม่มี paymentIntent ส่งกลับมา
  paymentIntent?: {
    id: string;
    client_secret: string;
    status: string;
    amount: number;
    currency: string;
    metadata: Record<string, string>;
  };
};

export type CreateOrderWithPaymentIntentResponse = {
  data: OrderWithPaymentIntent | OrderSummary;
  message: string | null;
};

export type GetPromotionOrderSummaryResponse = {
  data: {
    orders: Order[];
    orderItems: OrderItem[];
    summary: {
      totalOrders: number;
      pendingOrders: number;
      awaitingConfirmationOrders: number;
      confirmedOrders: number;
      preparingToShipOrders: number;
      cancelledAndRefundedOrders: number;
    };
  };
};

export type GetOneOrderResponse = { data: Order };

export type GetAllOrdersResponse = { data: Order[] };

export type GetUserOrdersResponse = { data: Order[] };

export type GetOrderVouchersOfUserParams = {
  orderId: string;
  voucherGroupId: string;
};

export type GetOrderVouchersOfUserResponse = {
  data: {
    orderVouchers: OrderVoucher[];
  };
};
