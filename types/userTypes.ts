import { User } from "@/types/baseTypes";

export type SignUpParam = {
  email: string;
  password: string;
};

export type SignUpResponse = {
  data: User;
  message: string;
};

export type LoginParam = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type LoginResponse = {
  data: AuthResponse;
  message: string;
};

// line login
export type LineLoginParam = {
  lineUid: string;
  displayName: string;
  email?: string | null;
  pictureUrl?: string | null;
};

export type LineLoginResponse = {
  data: AuthResponse;
};

export type EditProfileParam = {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
};

export type EditProfileResponse = {
  data: User;
};

export type GetCurrentUserResponse = {
  data: User;
};

export type CurrentUser = User;

export type VerifyUserParam = {
  phoneNumber: string;
  phoneVerified: boolean;
};

export type VerifyUserResponse = {
  data: User;
};
