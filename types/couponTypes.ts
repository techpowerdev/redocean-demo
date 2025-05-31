import { Coupon } from "@/types/baseTypes";

export type CreateCouponParams = {};
export type CreateCouponResponse = {};
export type GetAllCouponsResponse = {
  data: Coupon[];
};
export type GetCouponByIdResponse = {};
export type ValidateCouponParams = {
  code: string;
  orderValue: number;
  orderItems: {
    productItemId: string;
    productCategoryId: string;
    productName: string;
  }[];
};

export type ValidateCouponResponse = {
  data: { coupon: Coupon; discountValue: number };
};

export type UpdateCouponParams = {};
export type UpdateCouponResponse = {};
