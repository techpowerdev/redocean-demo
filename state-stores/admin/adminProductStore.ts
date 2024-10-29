import { Product } from "@/types/types";
import { create } from "zustand";

// สร้าง Zustand store
type State = {
  productLists: Product[] | null;
  selectedProduct: Product | null;
  loading: boolean;
};

type Action = {
  setProductLists: (products: Product[]) => void;
  selectProduct: (product: Product) => void;
  setLoading: (status: boolean) => void;
};

export const useProductStore = create<State & Action>((set) => ({
  productLists: null,
  selectedProduct: null,
  loading: true,

  setProductLists: (products) => set({ productLists: products }),
  selectProduct: (product) => set({ selectedProduct: product }),
  setLoading: (status) => set({ loading: status }),
}));
