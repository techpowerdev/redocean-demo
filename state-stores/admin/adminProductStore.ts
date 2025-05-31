import {
  getAllProductItems,
  // getProductItemById,
  // updateProductWithVariations,
  // updateProductVariant,
} from "@/services/productServices";
import { ProductItem } from "@/types/baseTypes";
import toast from "react-hot-toast";
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
      await updateProduct(id, { isActive: status });
      const updatedProduct = await getAllProductItems();
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
      const result = await updateProduct(id, { hasVariant: status });

      const updatedSelectedProduct = await getProductById(result.data.id);
      set({ selectedProduct: updatedSelectedProduct.data });

      const updatedProduct = await getAllProductItems();
      set({ productLists: updatedProduct.data });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  },
  // changeVariantStatus: async (id, status) => {
  //   try {
  //     const result = await updateProductVariant(id, { isActive: status });
  //     const updatedSelectedProduct = await getProductById(
  //       result.data.productId
  //     );
  //     set({ selectedProduct: updatedSelectedProduct.data });
  //     const updatedProduct = await getAllProductItems();
  //     set({ productLists: updatedProduct.data });
  //   } catch (error) {
  //     console.log(error);
  //     if (error instanceof Error) {
  //       const errorMessage = error.message;
  //       toast.error(errorMessage);
  //     }
  //   }
  // },
  changeVariantStatus: async (id, status) => {
    try {
      const result = await updateProductVariant(id, { isActive: status });
      const updatedSelectedProduct = await getProductById(
        result.data.productId
      );
      set({ selectedProduct: updatedSelectedProduct.data });

      const updatedProduct = await getAllProductItems();
      set({ productLists: updatedProduct.data });
    } catch (error) {
      console.log("Error in changeVariantStatus:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  },

  setLoading: (status) => set({ loading: status }),
  setOpenEditForm: (status) => set({ openEditForm: status }),
}));
