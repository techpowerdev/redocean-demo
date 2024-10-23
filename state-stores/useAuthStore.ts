import { create } from "zustand";

interface AuthState {
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isVerified: false,
  setIsVerified: (isVerified) => set({ isVerified }),
}));

export default useAuthStore;
