// import { ProductType } from "@/types/fetchTypes";
import { ProductType } from "@/types/productTypes";
import { create } from "zustand";

// สร้าง Zustand store
type State = {
  productLists: ProductType[] | null;
  selectedProduct: ProductType | null;
  loading: boolean;
  openEditForm: boolean;
};

type Action = {
  setProductLists: (products: ProductType[]) => void;
  selectProduct: (product: ProductType | null) => void;
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
