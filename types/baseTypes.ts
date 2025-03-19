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

  // relation
  refreshToken?: RefreshToken | null;
  addresses?: Address[] | null;
  orders?: Order[] | null;
  cart?: Cart | null;
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

  // relation
  user?: User | null;
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

  // relation
  user?: User | null;
};
/**
 * Model Category
 *
 */
export type Category = {
  name: string;
  id: string;

  // relation
  products?: Product[] | null;
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

  // relation
  category?: Category | null;
  productVariants?: ProductVariant[] | null;
  promotionActivities?: PromotionActivity[] | null;
  orderItems?: OrderItem[] | null;
  cartItems?: CartItem[] | null;
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
  variantOptions: VariantOption;
  productId: string;

  // relation
  product?: Product | null;
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

  // relation
  user?: User | null;
  cartItems?: CartItem[] | null;
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

  // relation
  cart?: Cart | null;
  product?: Product | null;
  promotionActivity?: PromotionActivity | null;
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

  // relation
  user?: User | null;
  orderItems?: OrderItem[] | null;
  payments?: Payment[] | null;
};
/**
 * Model OrderItem
 *
 */
export type OrderItem = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  sku: string;
  productId: string;
  quantity: number;
  promotionActivityId: string | null;
  unitPrice: number;
  discount: number;
  orderId: string;

  // relation
  order?: Order | null;
  product?: Product | null;
  promotionActivity?: PromotionActivity | null;

  // addition field sending from backend
  variantOptions?: string;
  name: string;
  description: string;
  image?: string;
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

  // relation
  promotion?: Promotion | null;
  banner?: Banner | null;
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

  // relation
  promotionActivities?: PromotionActivity[] | null;
  images?: Image[] | null;
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

  // relation
  promotion?: Promotion | null;
  product?: Product | null;
  cartItems?: CartItem[] | null;
  orderItems?: OrderItem[] | null;
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

  // relation
  image?: Image | null;
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

  // relation
  order?: Order | null;
};
/**
 * VariantOption
 *
 */
export type VariantOption = Record<string, string>;
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

// // include type of relation data
// export type UserWithRelations = User & {
//   refreshToken?: RefreshToken | null;
//   addresses?: Address[] | null;
//   orders?: Order[] | null;
//   cart?: Cart | null;
// };

// export type RefreshTokenWithRelation = RefreshToken & {
//   user?: User | null;
// };

// export type AddressWithRelation = Address & {
//   user?: User | null;
// };

// export type CategoryWithRelation = Category & {
//   products?: Product[] | null;
// };

// export type ProductWithRelation = Product & {
//   category?: Category | null;
//   productVariants?: ProductVariant[] | null;
//   promotionActivities?: PromotionActivity[] | null;
//   orderItems?: OrderItem[] | null;
//   cartItems?: CartItem[] | null;
// };

// export type ProductVariantWithRelation = ProductVariant & {
//   product?: Product | null;
// };

// export type CartWithRelation = Cart & {
//   user?: User | null;
//   cartItems?: CartItem[] | null;
// };
// export type CartItemWithRelation = CartItem & {
//   cart?: Cart | null;
//   product?: Product | null;
//   promotionActivity?: PromotionActivity | null;
// };

// export type OrderWithRelation = Order & {
//   user?: User | null;
//   orderItems?: OrderItem[] | null;
//   payments?: Payment[] | null;
// };

// export type OrderItemWithRelation = OrderItem & {
//   order?: Order | null;
//   product?: Product | null;
//   promotionActivity?: PromotionActivity | null;
// };

// export type ImageWithRelation = Image & {
//   promotion?: Promotion | null;
//   banner?: Banner | null;
// };

// export type PromotionWithRelation = Promotion & {
//   promotionActivities?: PromotionActivity[] | null;
//   images?: Image[] | null;
// };

// export type PromotionActivityWithRelation = PromotionActivity & {
//   promotion?: Promotion | null;
//   product?: Product | null;
//   cartItems?: CartItem[] | null;
//   orderItems?: OrderItem[] | null;
// };

// export type BannerWithRelation = Banner & {
//   image?: Image | null;
// };

// export type PaymentWithRelation = Payment & {
//   order?: Order | null;
// };
