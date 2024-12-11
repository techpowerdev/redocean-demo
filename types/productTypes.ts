export type CartProductType = {
  productId: string;
  promotionActivityId?: string;
  sku: string;
  unitPrice: number;
  discount?: number;
  specialDiscount?: number;
  quantity: number;
};

// export type ProductType = {
//   id: string;
//   sku: string;
//   name: string;
//   description: string;
//   image?: string;
//   price: number;
//   stock?: number;
//   hasVariant: boolean;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;

//   // relation
//   categoryId: string;
//   category: CategoryType;
//   productVariants?: ProductVariantType[] | null;
//   promotionActivities?: PromotionActivityType[] | null;
// };

// export type VariantOption = Record<string, string>;

// export type ProductVariantType = {
//   id: string;
//   productId: string;
//   product?: ProductType;
//   sku: string;
//   variantOptions: VariantOption;
//   price: number;
//   stock: number;
//   image: string;
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
//   OrderItem?: OrderItemType[] | null;
// };
