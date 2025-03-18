import { User } from "@/types/baseTypes";

export type SignUpParam = {
  email: string;
  password: string;
};

export type SignUpResponse = User;

export type LoginParam = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

// line login
export type LineLoginParam = {
  lineUid: string;
  displayName: string;
  email?: string | null;
  pictureUrl?: string | null;
};

export type LineLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type EditProfileParam = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
};

export type EditProfileResponse = User;

export type GetCurrentUserResponse = User;

export type VerifyUserParam = {
  phoneNumber: string;
  phoneVerified: boolean;
};

export type VerifyUserResponse = User;
