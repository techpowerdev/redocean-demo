export type StripeOrderItem = {
  unitPrice: number;
  discount: number;
  quantity: number;
};

export type StripeCreatePaymentIntentType = {
  currency: string;
  captureLater: boolean;
  paymentState: string;
  orderId: string;
  orderType: string;
  orderItems: StripeOrderItem[];
};

export type StripeCreatePaymentIntentResultType = {
  paymentIntent: {
    id: string;
    client_secret: string;
    // payment_method: string;
    // processing: string;
    status: string;
    amount: string;
    currency: string;
    metadata: string;
  };
  order: {
    totalAmount: number;
  };
};
