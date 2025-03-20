import { ShippingAddress } from "./addressTypes";
import { Order } from "@/types/baseTypes";

export type GetOneOrderResponse = { data: Order; message?: string | null };

export type GetAllOrdersResponse = { data: Order[] };

export type GetUserOrdersResponse = { data: Order[] };

export type GetOrderSummaryOfGroupBuyingResponse = { data: OrderSummary };

export type GetPromotionOrderResponse = { data: Order[] };

export type CreateOder = {
  orderType?: string;
  creditCardFee?: number | null;
  shippingFee?: number | null;
  totalAmount: number;
  returnAmount: number;
  status?: string;
  trackingNumber?: string | null;
  shippingAddress: {
    recipient: string | undefined;
    phoneNumber: string | undefined;
    address: string | undefined;
    street: string | undefined;
    subDistrict: string | undefined;
    district: string | undefined;
    province: string | undefined;
    postalCode: string | undefined;
  };

  orderItems: CreateOderItem[];
};

export type CreateOderItem = {
  sku: string;
  quantity: number;
  unitPrice: number;
  discount?: number | null;
  total: number;
  productId: string;
  promotionActivityId?: string | null;
};

export type OrderSummary = {
  totalOrders: number;
  pendingOrders: number;
  awaitingConfirmationOrders: number;
  confirmedOrders: number;
  preparingToShipOrders: number;
  cancelledAndRefundedOrders: number;
};

// refractor type

// ลงท้ายด้วย param/params หากเป็น type ของ input ใน function
export interface CreateOrderWithPaymentIntentParams {
  items: CreateOrderItem[];
  shippingAddress: ShippingAddress;
  currency?: string;
  captureLater?: boolean;
  paymentState?: PaymentState;
}

export interface CreateOrderItem {
  productId: string;
  sku: string;
  quantity: number;
  promotionActivityId?: string | null;
  promotionType?: string | null;
}

export type PaymentState = "initial_payment" | "additional_payment";

export type OrderWithPaymentIntent = {
  paymentIntent: {
    id: string;
    client_secret: string;
    status: string;
    amount: number;
    currency: string;
    metadata: Record<string, string>;
  };
  items: {
    productId: string;
    sku: string;
    name: string;
    description: string;
    variantOptions: string;
    image: string;
    promotionActivityId?: string | null;
    promotionType?: string | null;
    unitPrice: number;
    quantity: number;
    discount: number;
    discountedPrice: number;
    total: number;
    warningMessage?: string | null;
    isAvailableStock: boolean;
  }[];
  totalAmount: number;
  totalDiscount: number;
  netAmount: number;
  totalQuantity: number;
  nextProcess: boolean;
};

export type CreateOrderWithPaymentIntentResponse = {
  data: OrderWithPaymentIntent;
  message: string | null;
};
