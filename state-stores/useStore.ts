import { create } from "zustand";

interface StoreState {
  count: number;
  increase: () => void;
  reset: () => void;
}

export const useStore = create<StoreState>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));
