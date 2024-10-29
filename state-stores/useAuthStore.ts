import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface AuthState {
  isVerified: boolean;
}

export type Action = {
  setIsVerified: (isVerified: boolean) => void;
  isTokenValid: (token: string) => boolean;
};

const useAuthStore = create<AuthState & Action>((set) => ({
  isVerified: false,
  setIsVerified: (isVerified) => set({ isVerified }),
  isTokenValid: (token) => {
    try {
      const decoded: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp > currentTime;
    } catch (error) {
      console.error("Failed to decode token", error);
      return false;
    }
  },
}));

export default useAuthStore;
