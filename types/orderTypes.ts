import { ProductType } from "./productTypes";
import { PromotionActivityType } from "./promotionTypes";
import { UserType } from "./userTypes";

// types based on the prisma schema
export type OrderType = {
  id: string;
  orderType: string;
  creditCardFee?: number | null;
  shippingFee?: number | null;
  totalAmount: number;
  totalDiscount: number;
  netAmount: number;
  extraPayAmount?: number | null;
  payAmount?: number | null;
  returnAmount?: number | null;
  status: string;
  trackingNumber?: string | null;
  shippingAddress: {
    recipient: string;
    phoneNumber: string;
    address: string;
    street: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
  };
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;

  userId: string;

  user?: UserType | null;
  orderItems?: OrderItemType[] | null;
  payments?: PaymentItemType[] | null;
};

export type OrderItemType = {
  id: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  // total: number;
  createdAt: Date;
  updatedAt: Date;

  orderId: string;
  productId: string;
  promotionActivityId?: string | null;

  order?: OrderType | null;
  product?: ProductType | null;
  promotionActivity?: PromotionActivityType | null;

  variantOptions?: string;
  name: string;
  description: string;
  image?: string;
};

export type PaymentItemType = {
  id: string;
  amount: number;
  amountRefunded: number;
  captured: boolean;
  chargeId: string | null;
  orderId: string;
  paymentState: string;
  paymentStatus: string;
  paymentType: string | null;
  stripePaymentId: string;
  createdAt: Date;
  updatedAt: Date;
};
// end of types based on the prisma schema

// types for the client side
export type FetchOneOrderResponseType = {
  message?: string | null;
  data: OrderType;
};

export type FetchAllOrderResponseType = {
  message?: string | null;
  data: OrderType[];
};

export type CreateOderType = {
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

  orderItems: CreateOderItemType[];
};

export type CreateOderItemType = {
  sku: string;
  quantity: number;
  unitPrice: number;
  discount?: number | null;
  total: number;
  productId: string;
  promotionActivityId?: string | null;
};

export type OrderSummaryType = {
  totalOrders: number;
  pendingOrders: number;
  awaitingConfirmationOrders: number;
  confirmedOrders: number;
  preparingToShipOrders: number;
  cancelledAndRefundedOrders: number;
};

export type OrderSummaryReponseType = {
  message: string | null;
  data: OrderSummaryType;
};

// refractor type

// ลงท้ายด้วย param/params หากเป็น type ของ input ใน function
export interface CreateOrderWithPaymentIntentParams {
  items: CreateOrderItem[];
  shippingAddress: Address;
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

export interface Address {
  // id: string;
  recipient: string;
  phoneNumber: string;
  address: string;
  street: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  // isActive: boolean;
  // createdAt: Date;
  // updatedAt: Date;

  // userId: string;

  // user?: UserType | null;
}

export type PaymentState = "initial_payment" | "additional_payment";
export interface AddressResponse extends Address {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user?: UserType | null;
}

export interface CreateOrderWithPaymentIntentResponse {
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
}
