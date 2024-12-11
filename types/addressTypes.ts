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

export type CreateAddressType = Omit<
  AddressType,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateAddressType = Omit<
  AddressType,
  "id" | "userId" | "createdAt" | "updatedAt"
>;
