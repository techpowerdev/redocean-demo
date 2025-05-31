import { ProductItem } from "@/types/baseTypes";
import { ProductWithVariantionSchema } from "@/zod-schemas/productSchema";
import { z } from "zod";

type Prettify<T> = {
  [K in keyof T]: T[K];
};

export type CreateProductWithVariants = z.infer<
  typeof ProductWithVariantionSchema
>;

export type CreateProductWithVariantsParams = Prettify<
  Omit<CreateProductWithVariants, "options" | "variations"> & {
    tierVariations: CreateProductWithVariants["options"];
    models: Omit<CreateProductWithVariants["variations"], "id">;
  }
>;

export type CreateProductWithVariantsResponse = {
  data: ProductItem;
};

export type EditProductWithVariantsParams = Prettify<
  Omit<CreateProductWithVariants, "options" | "variations"> & {
    tierVariations: CreateProductWithVariants["options"];
    models: CreateProductWithVariants["variations"];
  }
>;

export type EditProductWithVariantsResponse = {
  data: ProductItem;
};

export type GetProductItemByIdResponse = { data: ProductItem };
export type GetAllProductItemsResponse = { data: ProductItem[] };

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export type productOptionValue = {
  optionId: string;
  value: string;
  image?: string | undefined;
};

export type productOption = {
  name: string;
  values: productOptionValue[];
};

export type productVariation = {
  id?: string | undefined;
  key: string;
  name: string;
  tierIndex: number[];
  stock: number;
  originalPrice: number;
  sku?: string | undefined;
};

export type productStatus = "normal" | "out_of_stock" | "unlisted" | "deleted";

export type CreateProductItemParams = {
  sku: string;
  name: string;
  description: string;
  images: string[];
  originalPrice: number;
  stock?: number;
  status?: productStatus;
  hasVariants?: boolean;
  productType?: string;
  fileUrl?: string;
  categoryId?: string;
};

export type CreateProductItemResponse = {
  data: ProductItem;
};

export type UpdateProductItemParams = Partial<CreateProductItemParams>;

export type UpdateProductItemResponse = {
  data: ProductItem;
};

// -----------------------------------------------
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
