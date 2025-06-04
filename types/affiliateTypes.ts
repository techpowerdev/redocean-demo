import {
  Affiliate,
  AFFILIATE_STATUS,
  Commission,
  CommissionPolicy,
  ShortLink,
  Withdraw,
  WITHDRAW_FEE_TYPE,
} from "@/types/baseTypes";

export type CreateAffiliateParams = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idCard: string;
  idCardImage: string;
  bankName: string;
  channelCode: string;
  accountHolderName: string;
  accountNumber: string;
  bookBankImage: string;
};

export type GetAllAffiliatesResponse = {
  data: Affiliate[];
};

export type GetAffiliateByIdResponse = {
  data: Affiliate;
};

export type GetUserAffiliateResponse = {
  data: Affiliate;
};

export type SearchAffiliatesResponse = {
  data: Affiliate[];
};

export type CreateAffiliateResponse = {
  data: Affiliate;
};

export type approveAffiliateParams = {
  status: AFFILIATE_STATUS;
  rejectReason: string | null;
};

export type approveAffiliateResponse = {
  data: Affiliate;
};

export type UpdateAffiliateParams = CreateAffiliateParams;

export type UpdateAffiliateResponse = {
  data: Affiliate;
};

export type GetAffiliateLinksResponse = {
  data: ShortLink[];
};

export type GenerateAffiliateLinkResponse = {
  data: ShortLink;
};

export type GetAffiliateDashboardResponse = {
  data: {
    clicks: number;
    totalOrders: number;
    totalSales: number;
    totalCommission: number;
    withdrawAmount: number;
    availableBalance: number;
    topProducts: {
      productItemId: string;
      productName: string;
      image?: string;
      totalRevenue: number;
      quantity: number;
    }[];
    trend: {
      clicks: {
        date: string; // YYYY-MM-DD
        count: number;
      }[];
      revenue: {
        date: string; // YYYY-MM-DD
        amount: number;
      }[];
    };
    filter: {
      months: number;
      fromDate: Date;
      toDate: Date;
    };
  };
};

export type GetAdminAffiliateDashboardResponse = {
  data: {
    affiliates: number;
    clicks: number;
    totalAffiliateOrders: number;
    totalSales: number;
    totalCommission: number;
    paidCommission: number;
    unpaidCommission: number;
    topAffiliates: {
      affiliateId: string;
      firstName: string;
      lastName: string;
      email?: string;
      orderCount: number;
      totalRevenue: number;
    }[];
    trend: {
      revenue: {
        date: string; // YYYY-MM-DD
        amount: number;
      }[];
      commissions: {
        date: string; // YYYY-MM-DD
        amount: number;
      }[];
    };
    filter: {
      months: number;
      fromDate: Date;
      toDate: Date;
    };
  };
};

export type GetAffiliateCommissionPolicyResponse = {
  data: CommissionPolicy;
};

export type CreateAffiliateCommissionPolicyParams = {
  orderCommissionRate: number;
  referralCommissionRate: number;
  minimumWithdrawAmount: number;
  withdrawFeeType: WITHDRAW_FEE_TYPE;
  withdrawFee: number;
  payoutSchedule: string;
  isActive: boolean;
};

export type CreateAffiliateCommissionPolicyResponse = {
  data: CommissionPolicy;
};

export type UpdateAffiliateCommissionPolicyParams = {
  orderCommissionRate: number;
  referralCommissionRate: number;
  minimumWithdrawAmount: number;
  withdrawFeeType: WITHDRAW_FEE_TYPE;
  withdrawFee: number;
  payoutSchedule: string;
  isActive: boolean;
};

export type UpdateAffiliateCommissionPolicyResponse = {
  data: CommissionPolicy;
};

export type GetAffiliateWithdrawResponse = {
  data: Withdraw;
};

export type GetAffiliateWithdrawByIdResponse = {
  data: Withdraw;
};

export type GetAffiliateWithdrawHistoryResponse = {
  data: Withdraw[];
};

export type GetAffiliateCommissionHistoryResponse = {
  data: Commission[];
};

export type GetAllAffiliateWithdrawsResponse = {
  data: Withdraw[];
};

export type SearchAffiliateWithdrawsResponse = {
  data: Withdraw[];
};

export type DigitalPayoutChannelProperties = {
  accountHolderName?: string | null;
  accountNumber: string;
  accountType?: string;
};

export type ReceiptNotification =
  | {
      emailTo?: string[] | null;
      emailCc?: string[] | null;
      emailBcc?: string[] | null;
    }
  | undefined;

export type GetPayoutResponse = {
  referenceId: string;
  channelCode: string;
  channelProperties: DigitalPayoutChannelProperties;
  amount: number;
  description?: string;
  currency: string;
  receiptNotification?: ReceiptNotification;
  metadata?: object;
  id: string;
  created: Date;
  updated: Date;
  businessId: string;
  status: string;
  failureCode?: string;
  estimatedArrivalTime?: Date;
};

export type CreateAffiliateWithdrawPayoutResponse = {
  data: GetPayoutResponse;
};

export type GetAffiliateWithdrawPayoutsResponse = {
  data: GetPayoutResponse[];
};

export type CancelAffiliateWithdrawPayoutResponse = {
  data: GetPayoutResponse;
};
