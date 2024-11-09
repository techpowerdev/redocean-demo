export enum Role {
  user = "user",
  admin = "admin",
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
  role: Role;
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

export type ProductType = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  images?: ImageType[] | null;
  orderDetails?: OrderDetailType[] | null;
};

export type ImageType = {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  productId?: string | null;
  eventId?: string | null;
};

export type EventType = {
  id: string;
  type: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  images?: ImageType[] | null;
  groupBuyEvent?: GroupBuyEventType[] | null;
};

export type GroupBuyEventType = {
  id: string;
  productName: string;
  productDescription: string;
  productImages: string[];
  productPrice: number;
  productStock: number;
  targetAmount: number;
  finalPrice: number;
  isCompleted: boolean;
  orderDetails?: OrderDetailType[] | null;
  eventId?: string | null;
};

export type OrderType = {
  id: string;
  type: string;
  creditCardFee: number;
  shippingFee: number;
  totalAmount: number;
  returnAmount: number;
  recipient: string;
  phoneNumber: string;
  address: string;
  trackingNumber?: string | null;
  status: ORDER_STATUS;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  orderDetails?: OrderDetailType[] | null;
};

export type OrderDetailType = {
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
