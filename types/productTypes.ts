import { CartItemType } from "./cartTypes";
import { CategoryType } from "./categoryTypes";
import { OrderItemType } from "./orderTypes";
import { PromotionActivityType } from "./promotionTypes";

// types based on the prisma schema
export type ProductType = {
  id: string;
  sku: string;
  name: string;
  description: string;
  image?: string | null;
  price: number;
  stock: number;
  hasVariant: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  categoryId?: string | null;

  // เป็นแค่ relations ไม่ได้มี field อยู่ใน database ดังนั้น ถ้าไม่มีการ include มาด้วยตอน query จะไม่ได้ส่งค่ามาใน response
  category?: CategoryType | null;
  productVariants?: ProductVariantType[] | null;
  promotionActivities?: PromotionActivityType[] | null;
  orderItems?: OrderItemType[] | null;
  cartItems?: CartItemType[] | null;
};

export type VariantOption = Record<string, string>;

export type ProductVariantType = {
  id: string;
  sku: string;
  variantOptions: VariantOption;
  price: number;
  stock: number;
  image?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  productId: string;

  product?: ProductType | null;
};

// end of types based on the prisma schema

// types for the client side
export type FetchAllProductResponseType = {
  message?: string | null;
  data: ProductType[];
};

export type FetchOneProductResponseType = {
  message?: string | null;
  data: ProductType;
};

export type CreateProductResponseType = {
  message?: string | null;
  data: ProductType;
};

export type EditProductResponseType = {
  message?: string | null;
  data: ProductType;
};

export type ChangeHasVariantStatusResponseType = {
  message?: string | null;
  data: ProductType;
};

export type ChangeVariantStatusResponseType = {
  message?: string | null;
  data: ProductVariantType;
};

export type CartProductType = {
  productId: string;
  promotionActivityId?: string;
  sku: string;
  unitPrice: number;
  discount?: number;
  specialDiscount?: number;
  quantity: number;
};
