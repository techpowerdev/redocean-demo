import { UserType } from "./userTypes";

// types based on the prisma schema
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

  user?: UserType | null;
};

// end of types based on the prisma schema

// types for the client side
export type CreateAddressType = Omit<
  AddressType,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateAddressType = Omit<
  AddressType,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type ShippingAddressType = Omit<
  AddressType,
  "id" | "isActive" | "createdAt" | "updatedAt" | "userId" | "user"
>;
