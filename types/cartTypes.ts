export type CartType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  userId: string;
  cartItems: CartItemType[];

  cartTotalAmount: number;
  cartTotalQuantity: number;
};

export type CartItemType = {
  id: string;
  sku: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;

  cartId: string;
  productId: string;
  promotionActivityId?: string | null;
};

// export type CartProductType = {
//   productId: string;
//   promotionActivityId?: string;
//   sku: string;
//   unitPrice: number;
//   discount?: number;
//   specialDiscount?: number;
//   quantity: number;
// };
