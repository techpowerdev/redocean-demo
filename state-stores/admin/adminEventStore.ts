import { EventType } from "@/types/fetchTypes";
import { Product } from "@/types/types";
import { create } from "zustand";

// สร้าง Zustand store
type State = {
  selectedProductInEvent: Product | null;
  selectedEventForm: string;
  eventLists: EventType[] | null;
  selectedEvent: EventType | null;
};

type Action = {
  selectProductInEvent: (product: Product) => void;
  selectEventForm: (form: string) => void;
  setEventLists: (events: EventType[]) => void;
  selectEvent: (event: EventType) => void;
};

export const useEventStore = create<State & Action>((set) => ({
  selectedProductInEvent: null,
  selectedEventForm: "GroupBuyEvent",
  eventLists: null,
  selectedEvent: null,
  selectProductInEvent: (product) => set({ selectedProductInEvent: product }),
  selectEventForm: (form) => set({ selectedEventForm: form }),
  setEventLists: (events) => set({ eventLists: events }),
  selectEvent: (event) => set({ selectedEvent: event }),
}));
