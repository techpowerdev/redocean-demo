export type CartProductType = {
  productId: string;
  promotionActivityId?: string;
  sku: string;
  unitPrice: number;
  discount?: number;
  specialDiscount?: number;
  quantity: number;
};

// export type CartProductType = {
//   productId: string;
//   productVariantId: string;
//   promotionId?: string | null;
//   promotionType: string;
//   sku: string | null;
//   name: string;
//   description: string;
//   color?: string | null;
//   size?: string | null;
//   quantity: number;
//   unitPrice: number;
//   discount?: number | null;
// };
