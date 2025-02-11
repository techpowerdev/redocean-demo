/**
 * Model User
 *
 */
export type User = {
  id: string;
  email: string | null;
  password: string | null;
  lineUid: string | null;
  displayName: string | null;
  pictureUrl: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  phoneVerified: boolean;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
/**
 * Model ResfreshToken
 *
 */
export type RefreshToken = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  token: string;
  expiresAt: Date;
  userId: string;
};
/**
 * Model Address
 *
 */
export type Address = {
  id: string;
  phoneNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  address: string;
  recipient: string;
  street: string | null;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
};
/**
 * Model Category
 *
 */
export type Category = {
  name: string;
  id: string;
};
/**
 * Model Product
 *
 */
export type Product = {
  name: string;
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  sku: string;
  description: string;
  image: string | null;
  price: number;
  stock: number;
  hasVariant: boolean;
  categoryId: string | null;
};
/**
 * Model ProductVariant
 *
 */
export type ProductVariant = {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  sku: string;
  image: string | null;
  price: number;
  stock: number;
  variantOptions: Record<string, string>;
  productId: string;
};
/**
 * Model Cart
 *
 */
export type Cart = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
/**
 * Model CartItem
 *
 */
export type CartItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sku: string;
  productId: string;
  quantity: number;
  promotionType: string | null;
  cartId: string;
  promotionActivityId: string | null;
};
/**
 * Model Order
 *
 */
export type Order = {
  id: string;
  orderType: OrderType;
  creditCardFee: number | null;
  shippingFee: number | null;
  totalAmount: number;
  totalDiscount: number;
  netAmount: number;
  paymentStatus: string;
  paidAmount: number;
  extraPaidAmount: number;
  returnAmount: number;
  status: OrderStatus;
  trackingNumber: string | null;
  shippingAddress: Address;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
/**
 * Model Image
 *
 */
export type Image = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  tag: string | null;
  promotionId: string | null;
  bannerId: string | null;
};
/**
 * Model Promotion
 *
 */
export type Promotion = {
  name: string;
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  type: PromotionType;
  startAt: Date;
  endAt: Date;
};
/**
 * Model PromotionActivity
 *
 */
export type PromotionActivity = {
  id: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  promotionId: string;
  discountType: DiscountType;
  discountAmount: number;
  limitQuantity: boolean;
  maxQuantity: number | null;
  limitQuantityPerUser: boolean;
  maxQuantityPerUser: number | null;
  minimumPurchaseQuantity: number | null;
};
/**
 * Model Banner
 *
 */
export type Banner = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  order: number;
};
/**
 * Model Payment
 *
 */
export type Payment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  paymentStatus: string;
  orderId: string;
  amount: number;
  paymentType: PaymentType | null;
  paymentState: PaymentState;
  stripePaymentId: string;
  chargeId: string | null;
  captured: boolean;
  amountRefunded: number;
};
/**
 * Enum Role
 *
 */
type Role = "user" | "admin";
/**
 * Enum OrderType
 *
 */
type OrderType = "general" | "flashsale" | "groupbuying";
/**
 * Enum ORDER_STATUS
 *
 */
type OrderStatus =
  | "need_to_pay"
  | "pending"
  | "awaiting_confirmation"
  | "confirmed"
  | "preparing_to_ship"
  | "shipping"
  | "return"
  | "completed"
  | "cancelled"
  | "cancelled_and_refunded"
  | "refunded";
/**
 * Enum PromotionType
 *
 */
type PromotionType = "flashsale" | "groupbuying" | "normal";
/**
 * Enum DiscountType
 *
 */
type DiscountType = "fixed" | "percent";
/**
 * Enum PaymentType
 *
 */
type PaymentType = "promptpay" | "card";
/**
 * Enum PaymentState
 *
 */
type PaymentState = "initial_payment" | "additional_payment";
