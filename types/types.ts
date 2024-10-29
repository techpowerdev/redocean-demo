export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum ORDER_STATUS {
  pending = "pending",
  shipping = "shipping",
  return = "return",
  success = "success",
  cancel = "cancel",
  failed = "failed",
  refunded = "refunded",
}

export type User = {
  id: string;
  email?: string | null;
  password?: string | null;
  lineUid?: string | null;
  displayName?: string | null;
  pictureUrl?: string | null;
  fullName?: string | null;
  phoneNumber?: string | null;
  phoneVerified: boolean;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens?: RefreshToken[];
  addresses?: Address[];
  orders?: Order[];
};

export type RefreshToken = {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
};

export type Address = {
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

export type Order = {
  id: string;
  creditCardFee: number;
  shippingFee: number;
  totalAmount: number;
  recipient: string;
  phoneNumber: string;
  address: string;
  trackingNumber?: string | null;
  status: ORDER_STATUS;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  orderDetails?: OrderDetail[];
};

export type OrderDetail = {
  id: string;
  name: string;
  option?: string | null;
  price: number;
  qty: number;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  orderId: string;
  productId: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  promotionPrice?: number | null;
  inStock: boolean;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  images?: Image[];
  options?: ProductOption[];
  categoryId?: string | null;
};

export type Image = {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
};

export type Category = {
  id: string;
  name: string;
  products?: Product[];
};

export type Color = {
  id: string;
  name: string;
  code: string;
  productOptions?: ProductOption[];
};

export type Size = {
  id: string;
  name: string;
  productOptions?: ProductOption[];
};

export type Brand = {
  id: string;
  name: string;
  productOptions?: ProductOption[];
};

export type ProductOption = {
  id: string;
  productId: string;
  colorId?: string | null;
  sizeId?: string | null;
  brandId?: string | null;
  imageId: string;
};
