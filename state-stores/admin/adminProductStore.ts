import { ProductItem } from "@/types/baseTypes";
import { create } from "zustand";

// สร้าง Zustand store
type State = {
  productLists: ProductItem[] | null;
  selectedProduct: ProductItem | null;
  loading: boolean;
  openEditForm: boolean;
};

type Action = {
  setProductLists: (products: ProductItem[]) => void;
  selectProduct: (product: ProductItem | null) => void;
  setLoading: (status: boolean) => void;
  setOpenEditForm: (status: boolean) => void;
};

export const useProductStore = create<State & Action>((set) => ({
  productLists: null,
  selectedProduct: null,
  loading: true,
  openEditForm: false,

  setProductLists: (products) => set({ productLists: products }),
  selectProduct: (product) => set({ selectedProduct: product }),
  setLoading: (status) => set({ loading: status }),
  setOpenEditForm: (status) => set({ openEditForm: status }),
}));
