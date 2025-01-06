import { UserType } from "./userTypes";

export type RefreshTokenType = {
  id: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updtedAt: Date;

  userId: string;

  user?: UserType | null;
};
