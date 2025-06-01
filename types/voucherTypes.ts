import { VoucherGroup } from "@/types/baseTypes";

export type CreateVoucherGroupWithVouchersParams = {
  storeName: string;
  description: string;
  // image?: string;
  amount: number;
  expiresAt?: string | null;
  limitPurchasePerUser: boolean;
  maxPurchasePerUser?: number;
  vouchers: { id: string; code: string }[];
};

export type UpdateVoucherGroupWithVouchersParams =
  Partial<CreateVoucherGroupWithVouchersParams>;

export type GetAllVoucherGroupsResponse = {
  data: VoucherGroup[];
};

export type GetVoucherGroupByIdResponse = {
  data: VoucherGroup;
};

export type GetAllVoucherGroupsForSellResponse = {
  data: Omit<VoucherGroup[], "vouchers">;
};

export type GetVoucherGroupByIdForSellResponse = {
  data: Omit<VoucherGroup, "vouchers">;
};

export type BuyVoucherParams = {
  voucherGroupId: string;
  quantity: number;
};

export type CreateOrderVoucherWithPaymentIntentParams = {
  voucherGroupId: string;
  quantity: number;
  currency?: string;
  captureLater?: boolean;
  paymentState?: "initial_payment" | "additional_payment";
};

export type CreateOrderVoucherWithPaymentIntentResponse = {
  data: {
    paymentIntent: {
      id: string;
      client_secret: string;
      status: string;
      amount: number;
      currency: string;
      metadata: Record<string, string>;
    };
  };
};
