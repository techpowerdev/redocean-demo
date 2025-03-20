import { Product, ProductVariant } from "@/types/baseTypes";

export type GetAllProductsForSellResponse = {
  data: Product[];
};

export type GetOneProductForSellResponse = {
  data: Product;
};

export type GetAllProductsResponse = {
  data: Product[];
};

export type GetProductByIdResponse = {
  data: Product;
};

export type CreateProductResponse = {
  data: Product;
};

export type UpdateProductResponse = {
  data: Product;
};

export type ChangeProductStatusResponse = {
  data: Product;
};

export type ChangeHasVariantStatusResponse = {
  data: Product;
};

export type CreateProductVariantResponse = {
  data: ProductVariant;
};

export type UpdateProductVariantResponse = {
  data: ProductVariant;
};

export type ChangeVariantStatusResponse = {
  data: ProductVariant;
};

export type CheckProductAvailabilityForUserParams = {
  items: {
    productId: string;
    sku: string;
    quantity: number;
    promotionActivityId?: string | null;
    promotionType?: string | null;
  }[];
};

export type CheckProductAvailabilityForUserResponse = {
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
