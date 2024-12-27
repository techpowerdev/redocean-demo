import { PromotionActivityType } from "./promotionTypes";

export type CartProductType = {
  productId: string;
  promotionActivityId?: string;
  sku: string;
  unitPrice: number;
  discount?: number;
  specialDiscount?: number;
  quantity: number;
};

export type ProductType = {
  id: string;
  sku: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  stock?: number;
  hasVariant: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  categoryId?: string | null;
  productVariants: ProductVariantType[];
  promotionActivities: PromotionActivityType[];
};

export type VariantOption = Record<string, string>;

export type ProductVariantType = {
  id: string;
  sku: string;
  variantOptions: VariantOption;
  price: number;
  stock: number;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  productId: string;
  product?: ProductType;
};

export type CreateProductType = {
  sku: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: { file: File }[];
};
