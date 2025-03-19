import {
  changeHasVariantStatus,
  changeProductStatus,
  changeVariantStatus,
  getAllProducts,
  getProductById,
} from "@/services/productServices";
import { Product } from "@/types/baseTypes";
import toast from "react-hot-toast";
import { create } from "zustand";

// สร้าง Zustand store
type State = {
  productLists: Product[] | null;
  selectedProduct: Product | null;
  loading: boolean;
  openEditForm: boolean;
};

type Action = {
  setProductLists: (products: Product[]) => void;
  selectProduct: (product: Product | null) => void;
  changeProductStatus: (id: string, status: boolean) => Promise<void>;
  changeHasVariantStatus: (id: string, status: boolean) => Promise<void>;
  changeVariantStatus: (id: string, status: boolean) => Promise<void>;
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
  changeProductStatus: async (id, status) => {
    try {
      await changeProductStatus(id, status);
      const updatedProduct = await getAllProducts();
      set({ productLists: updatedProduct.data });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  },
  changeHasVariantStatus: async (id, status) => {
    try {
      const result = await changeHasVariantStatus(id, status);

      const updatedSelectedProduct = await getProductById(result.data.id);
      set({ selectedProduct: updatedSelectedProduct.data });

      const updatedProduct = await getAllProducts();
      set({ productLists: updatedProduct.data });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  },
  changeVariantStatus: async (id, status) => {
    try {
      const result = await changeVariantStatus(id, status);
      const updatedSelectedProduct = await getProductById(
        result.data.productId
      );
      const updatedProduct = await getAllProducts();
      set({ selectedProduct: updatedSelectedProduct.data });
      set({ productLists: updatedProduct.data });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  },
  setLoading: (status) => set({ loading: status }),
  setOpenEditForm: (status) => set({ openEditForm: status }),
}));
