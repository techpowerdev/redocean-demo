import { VariantOption } from "./fetchTypes";

export type CartType = {
  id: string;
  cartItems: CartItemType[];
  cartTotalAmount: number;
  cartTotalQuantity: number;
};

export type CartItemType = {
  id: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  variantOptions?: VariantOption;
  quantity: number;
  unitPrice: number;
  discount: number;
  specialDiscount: number;
  productId: string;
  promotionActivityId?: string | null;
  warningMessage?: string | null;
};
