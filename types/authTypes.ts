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
