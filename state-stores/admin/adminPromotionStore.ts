import {
  changePromotionStatus,
  getAllPromotions,
} from "@/services/promotionServices";
import { Promotion, Product } from "@/types/baseTypes";
import toast from "react-hot-toast";
import { create } from "zustand";

// สร้าง Zustand store
type State = {
  selectedProductInPromotion: Product | null;
  selectedPromotionType: string;
  promotionLists: Promotion[] | null;
  selectedPromotion: Promotion | null;
};

type Action = {
  selectProductInPromotion: (product: Product | null) => void;
  selectPromotionType: (promotionType: string) => void;
  setPromotionLists: (promotions: Promotion[]) => void;
  selectPromotion: (promotion: Promotion | null) => void;
  changePromotionStatus: (id: string, status: boolean) => Promise<void>;
};

export const usePromotionStore = create<State & Action>((set) => ({
  selectedProductInPromotion: null,
  selectedPromotionType: "groupbuying",
  promotionLists: null,
  selectedPromotion: null,
  selectProductInPromotion: (product) =>
    set({ selectedProductInPromotion: product }),

  changePromotionStatus: async (id, status) => {
    try {
      await changePromotionStatus(id, status);
      const updatedPromotion = await getAllPromotions();
      set({ promotionLists: updatedPromotion.data });
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    }
  },

  selectPromotionType: (promotionType) =>
    set({ selectedPromotionType: promotionType }),
  setPromotionLists: (promotions) => set({ promotionLists: promotions }),
  selectPromotion: (promotion) => set({ selectedPromotion: promotion }),
}));
