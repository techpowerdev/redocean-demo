import { Address } from "@/types/baseTypes";

export type CreateAddressParam = {
  recipient: string;
  phoneNumber: string;
  address: string;
  street: string | null;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isActive?: boolean;
};

export type UpdateAddressParam = {
  recipient: string;
  phoneNumber: string;
  address: string;
  street: string | null;
  subDistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isActive: boolean;
};

export type CreateAddressResponse = { data: Address; message: string };
export type UpdateAddressResponse = { data: Address; message: string };
export type ChangeActiveAddressResponse = { data: Address; message: string };
export type DeleteAddressResponse = { data: Address; message: string };
export type GetAllAddressesResponse = { data: Address[]; message: string };

export type ShippingAddress = Omit<
  Address,
  "id" | "isActive" | "createdAt" | "updatedAt" | "userId" | "user"
>;
