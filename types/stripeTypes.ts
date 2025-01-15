export type StripeOrderItemType = {
  unitPrice: number;
  discount: number;
  quantity: number;
};

export type StripeCreatePaymentIntentForOneProductType = {
  productId: string;
  sku: string;
  quantity: number;
  promotionActivityId?: string;
  // promotionCode?: string;
  currency?: string;
  captureLater?: boolean;
  // paymentState: string;
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
  // paymentState: string; // move to check from metadata in stripe instead
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
  // order: {
  //   totalAmount: number;
  // };
};
