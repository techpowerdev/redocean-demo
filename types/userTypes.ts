import { AddressType } from "./addressTypes";
import { CartType } from "./cartTypes";
import { OrderType } from "./orderTypes";
import { RefreshTokenType } from "./refreshTokenTypes";

// types based on the prisma schema
export type UserType = {
  id: string;
  email?: string | null;
  password?: string | null;
  lineUid?: string | null;
  displayName: string | null;
  pictureUrl: string | null;
  fullName?: string | null;
  phoneNumber?: string | null;
  phoneVerified: boolean;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  refreshToken?: RefreshTokenType | null;
  addresses?: AddressType[] | null;
  orders?: OrderType[] | null;
  cart?: CartType | null;
};
// end of types based on the prisma schema

// types for the client side
export type SignUpType = {
  email: string;
  password: string;
};

export type SignUpResponseType = {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      lineUid: string;
      displayName: string;
      pictureUrl: string;
      phoneNumber: string;
      phoneVerified: boolean;
      role: string;
    };
  };
};

export type LoginType = SignUpType;

export type LoginResponseType = SignUpResponseType;

// line login
export type LineLoginType = {
  lineUid: string;
  displayName: string;
  email?: string | null;
  pictureUrl?: string | null;
};

export type EditProfileType = {
  fullName?: string;
  phoneNumber: string;
  email?: string;
};
