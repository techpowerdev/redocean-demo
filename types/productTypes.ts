import { Product, ProductVariant } from "@/types/baseTypes";

export type GetAllProductResponse = {
  message?: string | null;
  data: Product[];
};

export type GetProductByIdResponse = {
  message?: string | null;
  data: Product;
};

export type CreateProductResponseType = {
  message?: string | null;
  data: Product;
};

export type EditProductResponseType = {
  message?: string | null;
  data: Product;
};

export type ChangeHasVariantStatusResponseType = {
  message?: string | null;
  data: Product;
};

export type ChangeVariantStatusResponseType = {
  message?: string | null;
  data: ProductVariant;
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

export type CheckProductAvailabilityForUserPayloadType = {
  items: {
    productId: string;
    sku: string;
    quantity: number;
    promotionActivityId?: string | null;
    promotionType?: string | null;
  }[];
};

export type CheckProductAvailabilityForUserResponseType = {
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
