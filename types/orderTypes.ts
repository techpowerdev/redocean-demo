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
  createdAt: string;
  updatedAt: Date;
  userId: string;
  orderItems?: OrderItemType[] | null;
};

export type OrderItemType = {
  id: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  specialDiscount: number;
  total: number;
  productId: string;
  promotionActivityId?: string | null;
  variantOptions?: string;
  name: string;
  description: string;
  image?: string;
};

export type CreateOderType = {
  orderType?: string;
  creditCardFee?: number | null;
  shippingFee?: number | null;
  totalAmount: number;
  returnAmount: number;
  status?: string;
  trackingNumber?: string | null;
  shippingAddress: {
    recipient: string | undefined;
    phoneNumber: string | undefined;
    address: string | undefined;
    street: string | undefined;
    subDistrict: string | undefined;
    district: string | undefined;
    province: string | undefined;
    postalCode: string | undefined;
  };

  orderItems: CreateOderItemType[];
};

export type CreateOderItemType = Omit<
  OrderItemType,
  "id" | "variantOptions" | "name" | "description" | "image"
>;
