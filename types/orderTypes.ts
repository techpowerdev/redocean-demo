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
  returnAmount: number;
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
  createdAt: Date;
  updatedAt: Date;

  userId: string;

  user?: UserType | null;
  orderItems?: OrderItemType[] | null;
};

export type OrderItemType = {
  id: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount?: number | null;
  discountType?: string | null;
  // specialDiscount?: number | null;
  total: number;
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
  // specialDiscount: number | null;
  productId: string;
  promotionActivityId?: string | null;
  total: number;
};

export type OrderSummaryType = {
  totalOrders: number;
  pendingOrders: number;
  shippingOrders: number;
  completedOrders: number;
};
export type OrderSummaryReponseType = {
  message: string | null;
  data: OrderSummaryType;
};
