export type StripeOrderItemType = {
  unitPrice: number;
  discount: number;
  quantity: number;
};

export type StripeCreatePaymentIntentForOneProductType = {
  currency: string;
  captureLater: boolean;
  paymentState: string;
  orderId: string;
  orderType: string;
  orderItems: StripeOrderItemType[];
};

export type StripeCreatePaymentIntentForCartProductsType = {
  cartId: string;
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
    metadata: string;
  };
  // order: {
  //   totalAmount: number;
  // };
};
