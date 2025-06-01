// /**
//  * Model User
//  *
//  */
// export type User = {
//   id: string;
//   email: string | null;
//   password: string | null;
//   lineUid: string | null;
//   displayName: string | null;
//   pictureUrl: string | null;
//   fullName: string | null;
//   phoneNumber: string | null;
//   phoneVerified: boolean;
//   role: Role;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;

//   // relation
//   refreshToken?: RefreshToken | null;
//   addresses?: Address[] | null;
//   orders?: Order[] | null;
//   cart?: Cart | null;
// };
// /**
//  * Model ResfreshToken
//  *
//  */
// export type RefreshToken = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   token: string;
//   expiresAt: Date;
//   userId: string;

//   // relation
//   user?: User | null;
// };
// /**
//  * Model Address
//  *
//  */
// export type Address = {
//   id: string;
//   phoneNumber: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   userId: string;
//   address: string;
//   recipient: string;
//   street: string | null;
//   subDistrict: string;
//   district: string;
//   province: string;
//   postalCode: string;

//   // relation
//   user?: User | null;
// };
// /**
//  * Model ProductCategory
//  *
//  */
// export type ProductCategory = {
//   id: string;
//   name: string;

//   // relation
//   products?: Product[] | null;
// };
// /**
//  * Model Product
//  *
//  */
// export type Product = {
//   name: string;
//   id: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   sku: string;
//   description: string;
//   price: number;
//   stock: number;
//   hasVariant: boolean;
//   productCategoryId: string | null;
//   productType: ProductType;
//   fileUrl?: string | null;

//   // relation
//   images?: Image[] | null;
//   productCategory?: ProductCategory | null;
//   productVariants?: ProductVariant[] | null;
//   promotionActivities?: PromotionActivity[] | null;
//   orderItems?: OrderItem[] | null;
//   cartItems?: CartItem[] | null;
// };
// /**
//  * Model ProductVariant
//  *
//  */
// export type ProductVariant = {
//   id: string;
//   sku: string;
//   price: number;
//   stock: number;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   variantOptions: VariantOption;
//   imageId: string | null;
//   productId: string;

//   // relation
//   product?: Product | null;
//   image?: Image | null;
// };
// /**
//  * Model ProductItem
//  *
//  */
// export type ProductItem = {
//   id: string;
//   sku: string | null;
//   name: string;
//   description: string;
//   images: string[] | null;
//   originalPrice: number;
//   stock: number;
//   status: ProductItemStatus;
//   hasVariants: boolean;
//   productType: ProductType;
//   fileUrl: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   deletedAt: Date | null;
//   categoryId: string | null;

//   // relation
//   tierVariations: ProductTierVariation[];
//   models: ProductModel[];
// };
// /**
//  * Model ProductModel
//  *
//  */
// export type ProductModel = {
//   id: string;
//   key: string | null;
//   name: string;
//   tierIndex: number[];
//   originalPrice: number;
//   stock: number;
//   sku: string | null;
//   status: ProductModelStatus;
//   isDefault: boolean;
//   image: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   productItemId: string;
// };
// /**
//  * Model ProductTierVariation
//  *
//  */
// export type ProductTierVariation = {
//   id: string;
//   name: string;
//   values: [
//     {
//       optionId: string;
//       value: string;
//       image: string | null;
//     }
//   ];
//   createdAt: Date;
//   updatedAt: Date;
//   productItemId: string;
// };
// /**
//  * Model Cart
//  *
//  */
// export type Cart = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   userId: string;

//   // relation
//   user?: User | null;
//   cartItems?: CartItem[] | null;
// };
// /**
//  * Model CartItem
//  *
//  */
// export type CartItem = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   sku: string;
//   productId: string;
//   quantity: number;
//   promotionType: string | null;
//   cartId: string;
//   promotionActivityId: string | null;

//   // relation
//   cart?: Cart | null;
//   product?: Product | null;
//   promotionActivity?: PromotionActivity | null;

//   // Additional fields sent from the backend
//   unitPrice: number;
//   discount?: number | null;
//   variantOptions?: string | null;
//   name: string | null;
//   description: string;
//   image?: string | null;
//   warningMessage: string;
// };
// /**
//  * Model Order
//  *
//  */
// export type Order = {
//   id: string;
//   orderType: OrderType;
//   creditCardFee: number | null;
//   shippingFee: number | null;
//   totalAmount: number;
//   totalDiscount: number;
//   netAmount: number;
//   paymentStatus: string;
//   paidAmount: number;
//   extraPaidAmount: number;
//   returnAmount: number;
//   status: OrderStatus;
//   trackingNumber: string | null;
//   shippingAddress: Address;
//   cancelReason: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   userId: string;

//   // relation
//   user?: User | null;
//   orderItems?: OrderItem[] | null;
//   payments?: Payment[] | null;
// };
// /**
//  * Model OrderItem
//  *
//  */
// export type OrderItem = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   sku: string;
//   productId: string;
//   quantity: number;
//   promotionActivityId: string | null;
//   unitPrice: number;
//   discount: number;
//   orderId: string;

//   // relation
//   order?: Order | null;
//   product?: Product | null;
//   promotionActivity?: PromotionActivity | null;

//   // Additional fields sent from the backend
//   variantOptions?: string;
//   name: string;
//   description: string;
//   image?: string;
// };
// /**
//  * Model Image
//  *
//  */
// export type Image = {
//   id: string;
//   type: string | null;
//   createdAt: Date;
//   updatedAt: Date;
//   url: string;
//   tag: string | null;
//   sortOrder: number | null;
//   productId: string | null;
//   promotionId: string | null;
//   bannerId: string | null;

//   // relation
//   products?: Product | null;
//   promotion?: Promotion | null;
//   banner?: Banner | null;
// };
// /**
//  * Model Promotion
//  *
//  */
// export type Promotion = {
//   name: string;
//   id: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   description: string;
//   type: PromotionType;
//   startAt: Date;
//   endAt: Date;

//   // relation
//   promotionActivities?: PromotionActivity[] | null;
//   images?: Image[] | null;
// };
// /**
//  * Model PromotionActivity
//  *
//  */
// export type PromotionActivity = {
//   id: string;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
//   productId: string;
//   promotionId: string;
//   discountType: DiscountType;
//   discountAmount: number;
//   limitQuantity: boolean;
//   maxQuantity: number | null;
//   limitQuantityPerUser: boolean;
//   maxQuantityPerUser: number | null;
//   minimumPurchaseQuantity: number | null;

//   // relation
//   promotion?: Promotion | null;
//   product?: Product | null;
//   cartItems?: CartItem[] | null;
//   orderItems?: OrderItem[] | null;
// };
// /**
//  * Model Banner
//  *
//  */
// export type Banner = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   order: number;

//   // relation
//   image?: Image | null;
// };
// /**
//  * Model Payment
//  *
//  */
// export type Payment = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   paymentStatus: string;
//   orderId: string;
//   amount: number;
//   paymentType: PaymentType | null;
//   paymentState: PaymentState;
//   stripePaymentId: string;
//   chargeId: string | null;
//   captured: boolean;
//   amountRefunded: number;

//   // relation
//   order?: Order | null;
// };
// /**
//  * VariantOption
//  *
//  */
// export type VariantOption = Record<string, string>;
// /**
//  * Enum Role
//  *
//  */
// type Role = "user" | "admin";
// /**
//  * Enum ProductType
//  *
//  */
// type ProductType = "digital_product" | "physical_product";
// /**
//  * Enum ProductItemStatus
//  *
//  */
// type ProductItemStatus = "normal" | "out_of_stock" | "unlisted" | "deleted";
// /**
//  * Enum ProductModelStatus
//  *
//  */
// type ProductModelStatus = "normal" | "unavailable";
// /**
//  * Enum OrderType
//  *
//  */
// type OrderType = "general" | "flashsale" | "groupbuying";
// /**
//  * Enum ORDER_STATUS
//  *
//  */
// type OrderStatus =
//   | "need_to_pay"
//   | "pending"
//   | "awaiting_confirmation"
//   | "confirmed"
//   | "preparing_to_ship"
//   | "shipping"
//   | "return"
//   | "completed"
//   | "cancelled"
//   | "cancelled_and_refunded"
//   | "refunded";
// /**
//  * Enum PromotionType
//  *
//  */
// type PromotionType = "flashsale" | "groupbuying" | "normal";
// /**
//  * Enum DiscountType
//  *
//  */
// type DiscountType = "fixed" | "percent";
// /**
//  * Enum PaymentType
//  *
//  */
// type PaymentType = "promptpay" | "card";
// /**
//  * Enum PaymentState
//  *
//  */
// type PaymentState = "initial_payment" | "additional_payment";

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// version 2
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
  role: USER_ROLE;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relation
  addresses?: Address[];
  orders?: Order[];
  cart?: Cart | null;
};
/**
 * Model Address
 *
 */
export type Address = {
  id: string;
  recipient: string;
  phoneNumber: string;
  address: string;
  street: string | null;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;

  // FK
  userId: string;

  // Relation
  user?: User | null;
};
/**
 * Model Affiliate
 *
 */
export type Affiliate = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idCard: string;
  idCardImage: string;
  bankName: string;
  channelCode: string;
  accountHolderName: string;
  accountNumber: string;
  bookBankImage: string;
  totalCommission: number;
  status: AFFILIATE_STATUS;
  rejectReason: string | null;

  referralCode: string;

  createdAt: Date;
  updatedAt: Date;

  // FK
  userId: string;
  referralId: string | null;

  // Relation
  referredBy?: Affiliate;
  referrals?: Affiliate;
  user?: User;
  clicks?: Click[];
  commissions?: Commission[];
  withdraws?: Withdraw[];
  orders?: Order[];
  shortLinks?: ShortLink[];
};
/**
 * Model ShortLink
 *
 */
export type ShortLink = {
  id: string;
  shortCode: string;
  targetUrl: string;
  createdAt: Date;

  // FK
  affiliateId: string;
  productItemId: string | null;

  // Relation
  affiliate: Affiliate;
  productItem: ProductItem;
  clicks: Click[];
};
/**
 * Model Click
 *
 */
export type Click = {
  id: string;
  ipAddress: string;
  userAgent: string;
  clickedAt: Date;

  // FK
  affiliateId: string;
  shortLinkId: string | null;
  productItemId: string | null;

  // Relation
  affiliate?: Affiliate;
  shortlink?: ShortLink;
  productItem?: ProductItem;
};
/**
 * Model Commission
 *
 */
export type Commission = {
  id: string;
  amount: number;
  status: COMMISSION_STATUS;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;

  // FK
  orderId: string;
  affiliateId: string;

  // Relation
  order?: Order;
  affiliate?: Affiliate;
};
/**
 * Model CommissionPolicy
 *
 */
export type CommissionPolicy = {
  id: string;
  productCommissionRate: number; // อัตราคอมมิชชันจากสินค้า (%)
  referralCommissionRate: number; // อัตราคอมมิชชันจากการแนะนำ (%)
  minimumWithdrawAmount: number; // ยอดขั้นต่ำในการถอน
  withdrawFeeType: WITHDRAW_FEE_TYPE;
  withdrawFee: number; // ค่าธรรมเนียมการถอน
  payoutSchedule: string; // ทุกๆ วันที่ 14 และ 28 ของเดือน (optional)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
/**
 * Model Withdraw
 *
 */
export type Withdraw = {
  id: string;
  amount: number;
  withdrawFee: number;
  status: WITHDRAW_STATUS;
  requestedAt: Date;
  processedAt: string | null;
  bankName: string;
  channelCode: string;
  accountHolderName: string;
  accountNumber: string;
  rejectReason: string | null;
  updatedAt: string;

  // FK
  affiliateId: string;

  // Relation
  affiliate?: Affiliate;
};
/**
 * Model PayoutChannel
 *
 */
export type PayoutChannel = {
  id: string;
  channelCode: string;
  bankName: string;
  createdAt: Date;
  updatedAt: Date;
};
/**
 * Model ProductCategory
 *
 */
export type ProductCategory = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;

  // Relation
  productItems?: ProductItem[];
};

/**
 * Model ProductItem
 *
 */
export type ProductItem = {
  id: string;
  sku: string | null;
  name: string;
  description: string;
  images: string[] | null;
  originalPrice: number;
  stock: number;
  status: PRODUCT_ITEM_STATUS;
  hasVariants: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // FK
  categoryId: string;

  // Relation
  category?: ProductCategory;
  tierVariations?: ProductTierVariation[];
  models?: ProductModel[];
  promotionActivities?: PromotionActivity[];
  orderItems?: OrderItem[];
  cartItems?: CartItem[];
};
/**
 * Model ProductTierVariation
 *
 */
export type ProductTierVariation = {
  id: string;
  name: string;
  values: [
    {
      optionId: string;
      value: string;
      image: string | null;
    }
  ];
  createdAt: Date;
  updatedAt: Date;

  // FK
  productItemId: string;

  // Relation
  productItem?: ProductItem;
};
/**
 * Model ProductModel
 *
 */
export type ProductModel = {
  id: string;
  key: string | null;
  name: string;
  tierIndex: number[];
  originalPrice: number;
  stock: number;
  sku: string | null;
  status: PRODUCT_MODEL_STATUS;
  isDefault: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;

  // FK
  productItemId: string;

  // Relation
  productItem: ProductItem;
  cartItems: CartItem[];
};
/**
 * Model VoucherGroup
 *
 */
export type VoucherGroup = {
  id: string;
  storeName: string;
  description: string;
  // image: string | null;
  amount: number;
  limitPurchasePerUser: boolean;
  maxPurchasePerUser: number | null;
  expiresAt: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relation
  vouchers?: Voucher[];
};
/**
 * Model Voucher
 *
 */
export type Voucher = {
  id: string;
  code: string;
  // isRedeemed     :boolean
  // redeemedAt    : Date|null
  expiresAt: Date | null;
  isSold: boolean;
  soldAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // FK
  voucherGroupId: string;

  // Relation
  voucherGroup?: VoucherGroup;
};
/**
 * Model Cart
 *
 */
export type Cart = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // FK
  userId: string;

  // Relation
  user?: User;
  cartItems?: CartItem[];
};
/**
 * Model CartItem
 *
 */
export type CartItem = {
  id: string;
  quantity: number;
  promotionType: string | null;
  unitPrice: number; // ราคาต่อชิ้น
  discount: number; // ราคาส่วนลดต่อชิ้น
  discountedPrice: number; // ราคาหลังหักส่วนลดต่อชิ้น
  totalDiscount: number; // มูลค่าส่วนลดทั้งหมด(บาท)
  total: number; // ราคารวมหลังหักส่วนลดแล้ว(บาท)
  status: CART_ITEM_STATUS;
  warningMessage: string | null;
  createdAt: Date;
  updatedAt: Date;

  // FK
  cartId: string;
  productItemId: string;
  productModelId: string;
  promotionId: string | null;
  promotionActivityId: string | null;

  // Relation
  cart?: Cart;
  productItem?: ProductItem | null;
  productModel?: ProductModel | null;
  promotion?: Promotion | null;
  promotionActivity?: PromotionActivity | null;
};
/**
 * Model Order
 *
 */
export type Order = {
  id: string;
  creditCardFee: number | null;
  shippingFee: number | null;
  totalAmount: number;
  totalDiscount: number;
  couponDiscount: number;
  netAmount: number;
  paymentStatus: string;
  paidAmount: number;
  extraPaidAmount: number;
  returnAmount: number;
  status: ORDER_STATUS;
  trackingNumber: string | null;
  shippingAddress: Address;
  cancelReason: string | null;
  createdAt: Date;
  updatedAt: Date;

  // FK
  userId: string;
  couponId: string | null;

  // relation
  user?: User;
  coupon?: Coupon | null;
  orderItems?: OrderItem[];
  orderVouchers?: OrderVoucher[];
  payments?: Payment[];
};
/**
 * Model OrderItem
 *
 */
export type OrderItem = {
  id: string;
  productName: string;
  modelName: string | null;
  image: string | null;
  unitPrice: number; //ราคาต่อชิ้น
  quantity: number;
  promotionType: string | null;
  discount: number; // ราคาส่วนลดต่อชิ้น
  discountedPrice: number; // ราคาหลังหักส่วนลดต่อชิ้น
  totalDiscount: number; // มูลค่าส่วนลดทั้งหมด(บาท) = discount * quantity
  total: number; // ราคารวมก่อนหักส่วน(บาท) = unitPrice * quantity
  netAmount: number; // ราคารวมหลังหักส่วนลดแล้ว(บาท) = discountedPrice * quantity
  createdAt: Date;
  updatedAt: Date;

  // FK
  orderId: string;
  productItemId: string;
  productModelId: string;
  promotionId: string | null;
  promotionActivityId: string | null;

  // relation
  order?: Order;
  productItem?: ProductItem | null;
  productModel?: ProductModel | null;
  promotion?: Promotion | null;
  promotionActivity?: PromotionActivity | null;
};
/**
 * OrderVoucher
 *
 */
export type OrderVoucher = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  userId: string;

  // FK
  orderId: string;
  voucherId: string;
  voucherGroupId: string;

  // Relation
  order?: Order;
  voucher?: Voucher;
  voucherGroup?: VoucherGroup;
};
/**
 * Model Image
 *
 */
export type Image = {
  id: string;
  type: string | null;
  url: string;
  tag: string | null;
  sortOrder: number | null;
  createdAt: Date;
  updatedAt: Date;

  // FK
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
  id: string;
  type: PROMOTION_TYPE;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relation
  images?: Image[];
  promotionActivities?: PromotionActivity[];
  cartItems?: CartItem[];
};
/**
 * Model PromotionActivity
 *
 */
export type PromotionActivity = {
  id: string;
  discountType: DISCOUNT_TYPE;
  discountAmount: number;
  limitQuantity: boolean;
  maxQuantity: number | null;
  limitQuantityPerUser: boolean;
  maxQuantityPerUser: number | null;
  minimumPurchaseQuantity: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  // FK
  promotionId: string;
  productItemId: string | null;

  // Relation
  promotion?: Promotion;
  productItem?: ProductItem | null;
  cartItems?: CartItem[];
  orderItems?: OrderItem[];
};
/**
 * Model Banner
 *
 */
export type Banner = {
  id: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;

  // Relation
  image?: Image | null;
};
/**
 * Model Payment
 *
 */
export type Payment = {
  id: string;
  amount: number;
  paymentType: PAYMENT_TYPE | null;
  paymentState: PAYMENT_STATE;
  paymentStatus: string;
  stripePaymentId: string;
  chargeId: string | null;
  captured: boolean;
  amountRefunded: number;
  createdAt: Date;
  updatedAt: Date;

  // FK
  orderId: string;

  // relation
  order?: Order;
};
/**
 * Model Coupon
 *
 */
export type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discountType: DISCOUNT_TYPE;
  discountValue: number;
  minOrderValue: number | null;
  maxDiscount: number | null;
  validFrom: Date | null;
  validUntil: Date | null;
  isActive: boolean;
  limitUsed: boolean;
  maxUsed: number | null;
  limitUsedPerUser: boolean;
  maxUsedPerUser: number | null;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;

  // Relation
  orders?: Order[];
  userCoupon?: UserCoupon[];
  excludedProductCategories?: ExcludeProductCategory[];
};
/**
 * Model ExcludeProductCategory
 *
 */
export type ExcludeProductCategory = {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // FK
  couponId: string;
  productCategoryId: string;

  // Relation
  coupon?: Coupon;
  productCategory?: ProductCategory;
};
/**
 * Model UserCoupon
 *
 */
export type UserCoupon = {
  id: string;
  usedCount: number;
  createdAt: Date;
  updatedAt: Date;

  // FK
  userId: string;
  couponId: string;

  // Relation
  user?: User;
  coupon?: Coupon;
};
/**
 * Enum USER_ROLE
 *
 */
export type USER_ROLE = "user" | "admin";
/**
 * Enum AffiliateStatus
 *
 */
export type AFFILIATE_STATUS = "pending" | "approved" | "rejected";
/**
 * Enum CommissionStatus
 *
 */
export type COMMISSION_STATUS = "pending" | "paid" | "cancelled";
/**
 * Enum WithdrawStatus
 *
 */
export type WITHDRAW_STATUS =
  | "pending"
  | "processing"
  | "approved"
  | "rejected"
  | "paid";
/**
 * Enum WithdrawFeeType
 *
 */
export type WITHDRAW_FEE_TYPE = "percent" | "fixed";
/**
 * Enum ProductItemStatus
 *
 */
export type PRODUCT_ITEM_STATUS =
  | "normal"
  | "out_of_stock"
  | "unlisted"
  | "deleted";
/**
 * Enum ProductModelStatus
 *
 */
export type PRODUCT_MODEL_STATUS = "normal" | "unavailable";
/**
 * Enum PromotionType
 *
 */
export type PROMOTION_TYPE = "flashsale" | "groupbuying";
/**
 * Enum DiscountType
 *
 */
export type DISCOUNT_TYPE = "fixed" | "percent";
/**
 * Enum CartItemStatus
 *
 */
export type CART_ITEM_STATUS = "available" | "unavailable";
/**
 * Enum OrderType
 *
 */
// type ORDER_TYPE = "general" | "flashsale" | "groupbuying";
/**
 * Enum ORDER_STATUS
 *
 */
export type ORDER_STATUS =
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
 * Enum PaymentType
 *
 */
export type PAYMENT_TYPE = "promptpay" | "card";
/**
 * Enum PaymentState
 *
 */
export type PAYMENT_STATE = "initial_payment" | "additional_payment";
