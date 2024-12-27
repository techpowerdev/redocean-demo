export type UserType = {
  id: string;
  email?: string | null;
  password?: string | null;
  lineUid?: string | null;
  displayName?: string | null;
  pictureUrl?: string | null;
  fullName?: string | null;
  phoneNumber?: string | null;
  phoneVerified: boolean;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens?: RefreshTokenType[] | null;
  addresses?: AddressType[] | null;
  orders?: OrderType[] | null;
};

export type RefreshTokenType = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
};

export type AddressType = {
  id: string;
  recipient: string;
  phoneNumber: string;
  address: string;
  street: string;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type CategoryType = {
  id: string;
  name: string;
  products?: ProductType[] | null;
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
  categoryId: string;
  productVariants?: ProductVariantType[] | null;
  promotionActivities?: PromotionActivityType[] | null;
};

// export type VariantOption = {
//   [key: string]: string | undefined; // สำหรับรองรับ key อื่นที่ไม่คาดคิด
// };
export type VariantOption = Record<string, string>;

export type ProductVariantType = {
  id: string;
  productId: string;
  product?: ProductType;
  sku: string;
  variantOptions: VariantOption;
  price: number;
  stock: number;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  OrderItem?: OrderItemType[] | null;
};

export type OrderType = {
  id: string;
  orderType: string;
  creditCardFee?: number | null;
  shippingFee?: number | null;
  totalAmount: number;
  returnAmount: number;
  status: string;
  trackingNumber?: string | null;
  shippingAddress: {
    recipient: string;
    phoneNumber: string;
    address: string;
    street: string;
    subDistrict: string;
    district: string;
    province: string;
    postalCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  orderItems?: OrderItemType[] | null;
};

export type OrderItemType = {
  id: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount?: number | null;
  specialDiscount?: number | null;
  total: number;
  orderId: string;
  productId: string;
  promotionActivityId: string;
  createdAt: Date;
  updatedAt: Date;
  productVariant?: ProductVariantType;
  promotionId?: string | null;
};

export type PromotionType = {
  id: string;
  type: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  promotionActivities?: PromotionActivityType[] | null;
  orderItems?: OrderItemType[] | null;
  images: Image[] | null;
};

export type Image = {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  promotionId?: string | null;
};

export type PromotionActivityType = {
  id: string;
  discountType: string;
  discountAmount?: number | null;
  limitQuantity: boolean;
  maxQuantity?: number | null;
  limitQuantityPerUser: boolean;
  maxQuantityPerUser?: number | null;
  minimumPurchaseQuantity?: number | null;
  discountGroupAmount?: number | null;
  isActive: boolean;
  promotionId: string;
  productId: string;
  product: ProductType;
};

// // version 2
// export type UserType = {
//   id: string;
//   email?: string | null;
//   password?: string | null;
//   lineUid?: string | null;
//   displayName?: string | null;
//   pictureUrl?: string | null;
//   fullName?: string | null;
//   phoneNumber?: string | null;
//   phoneVerified: boolean;
//   role: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;

//   // relation
//   refreshTokens: RefreshTokenType[];
//   addresses: AddressType[];
//   orders: OrderType[];
//   cart?: CartType | null;
// };

// export type RefreshTokenType = {
//   id: string;
//   token: string;
//   expiresAt: Date;
//   createdAt: Date;

//   // relation
//   userId: string;
// };

// export type AddressType = {
//   id: string;
//   recipient: string;
//   phoneNumber: string;
//   address: string;
//   street?: string | null;
//   subDistrict: string;
//   district: string;
//   province: string;
//   postalCode: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;

//   // relation
//   userId: string;
// };

// export type CategoryType = {
//   id: string;
//   name: string;
//   products?: ProductType[] | null;
// };

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
//   categoryId: string;
//   productVariants?: ProductVariantType[] | null;
//   promotionActivities?: PromotionActivityType[] | null;
// };

// // export type VariantOption = {
// //   [key: string]: string | undefined; // สำหรับรองรับ key อื่นที่ไม่คาดคิด
// // };
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

// export type OrderType = {
//   id: string;
//   orderType: string;
//   creditCardFee?: number | null;
//   shippingFee?: number | null;
//   totalAmount: number;
//   returnAmount?: number | null;
//   status: string;
//   trackingNumber?: string | null;
//   shippingAddress: {
//     recipient: string;
//     phoneNumber: string;
//     address: string;
//     street: string;
//     subDistrict: string;
//     district: string;
//     province: string;
//     postalCode: string;
//   };
//   createdAt: Date;
//   updatedAt: Date;
//   userId: string;
//   orderItems?: OrderItemType[] | null;
// };

// export type OrderItemType = {
//   id: string;
//   sku: string;
//   quantity: number;
//   unitPrice: number;
//   discount?: number | null;
//   specialDiscount?: number | null;
//   total: number;
//   orderId: string;
//   productId: string;
//   promotionActivityId: string;
//   createdAt: Date;
//   updatedAt: Date;
//   productVariant?: ProductVariantType;
//   promotionId?: string | null;
// };

// export type PromotionType = {
//   id: string;
//   type: string;
//   name: string;
//   description: string;
//   startAt: string;
//   endAt: string;
//   isActive: boolean;
//   promotionActivities?: PromotionActivityType[] | null;
//   orderItems?: OrderItemType[] | null;
// };

// export type PromotionActivityType = {
//   id: string;
//   discountType: string;
//   discountAmount?: number | null;
//   limitQuantity: boolean;
//   maxQuantity?: number | null;
//   limitQuantityPerUser: boolean;
//   maxQuantityPerUser?: number | null;
//   minimumPurchaseQuantity?: number | null;
//   discountGroupAmount?: number | null;
//   isActive: boolean;
//   promotionId: string;
//   productId: string;
//   product: ProductType;
// };

// export type CartType = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;

//   // relation
//   userId: string;
//   user: UserType;
//   cartItems: CartItemType[];
// };

// export type CartItemType = {
//   id: string;
//   sku: string;
//   quantity: number;
//   unitPrice: number;
//   discount?: number;
//   specialDiscount?: number;
//   createdAt: Date;
//   updatedAt: Date;

//   // relation
//   cartId: string;
//   cart: CartType;
//   productId: string;
//   product: ProductType;
//   promotionActivityId?: string;
//   promotionActivity?: PromotionActivityType;
// };
