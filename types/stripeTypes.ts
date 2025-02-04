import { ShippingAddressType } from "@/types/addressTypes";

type PaymentStateType = "initial_payment" | "additional_payment"; //  การจ่ายเงินครั้งแรก ,การจ่ายเงินเพิ่มเติม

export type StripeCreatePaymentIntentProductItemType = {
  productId: string;
  sku: string;
  quantity: number;
  promotionActivityId?: string | null;
  promotionType?: string | null;
};

export type StripeCreatePaymentIntentType = {
  items: StripeCreatePaymentIntentProductItemType[];
  shippingAddress: ShippingAddressType;
  // promotionCode?: string;
  currency?: string;
  captureLater?: boolean;
  paymentState?: PaymentStateType;
};

export type StripeCreatePaymentIntentForOneProductType = {
  productId: string;
  sku: string;
  quantity: number;
  promotionActivityId?: string | null;
  // promotionCode?: string;
  currency?: string;
  captureLater?: boolean;
  paymentState: "initial_payment" | "additional_payment";
};

export type StripeCreatePaymentIntentForCartProductsType = {
  cartItems: {
    id: string;
    productId: string;
    sku: string;
    quantity: number;
  }[];
  // promotionCode?: string;
  currency?: string;
  captureLater?: boolean;
  paymentState: PaymentStateType;
};

export type StripeCreatePaymentIntentResultType = {
  paymentIntent: {
    id: string;
    client_secret: string;
    // payment_method: string;
    // processing: string;
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
};

export interface CreatePaymentIntentParam {
  orderId: string;
  amount: number;
  currency?: string; // default: "thb"
  captureLater?: boolean; // default: false
  paymentState?: PaymentStateType; // default: "initial_payment"
}
export interface CreatePaymentIntentResponse {
  clientSecret: string;
}
