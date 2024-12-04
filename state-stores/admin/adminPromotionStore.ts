import { ProductType, PromotionType } from "@/types/fetchTypes";
import { create } from "zustand";

// สร้าง Zustand store
type State = {
  selectedProductInPromotion: ProductType | null;
  selectedPromotionType: string;
  promotionLists: PromotionType[] | null;
  selectedPromotion: PromotionType | null;
};

type Action = {
  selectProductInPromotion: (product: ProductType | null) => void;
  selectPromotionType: (promotionType: string) => void;
  setPromotionLists: (promotions: PromotionType[]) => void;
  selectPromotion: (promotion: PromotionType | null) => void;
};

export const usePromotionStore = create<State & Action>((set) => ({
  selectedProductInPromotion: null,
  selectedPromotionType: "groupbuying",
  promotionLists: null,
  selectedPromotion: null,
  selectProductInPromotion: (product) =>
    set({ selectedProductInPromotion: product }),
  selectPromotionType: (promotionType) =>
    set({ selectedPromotionType: promotionType }),
  setPromotionLists: (promotions) => set({ promotionLists: promotions }),
  selectPromotion: (promotion) => set({ selectedPromotion: promotion }),
}));
