export type User = {
  id: string;
  email: string | null;
  lineUid: string | null;
  displayName: string | null;
  pictureUrl: string | null;
  fullName: string | null;
  phoneNumber: string | null;
  phoneVerified: boolean;
  readonly role: string;
};

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
