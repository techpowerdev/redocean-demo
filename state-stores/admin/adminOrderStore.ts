import { changeOrderStatus, getAllOrders } from "@/services/orderServices";
import { FetchAllOrderResponseType, OrderType } from "@/types/orderTypes";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export type State = {
  orders: OrderType[] | null;
};

export type Action = {
  setOrders: (order: OrderType[] | null) => void;
  changeOrderStatus: (id: string, status: string) => void;
};

export const useAdminOrderStore = create<State & Action>()((set) => ({
  orders: null,
  setOrders: (orders) => set(() => ({ orders: orders })),
  changeOrderStatus: async (id, status) => {
    try {
      const response = await changeOrderStatus(id, status);
      toast.success(response?.message || "แก้ไขสถานะแล้ว");
      const updatedOrders: FetchAllOrderResponseType = await getAllOrders();
      set({ orders: updatedOrders.data });
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || "แก้ไขสถานะไม่สำเร็จ";
        toast.error(errorMessage);
      } else {
        toast.error("เกิดข้อผิดพลาดบางอย่าง");
      }
    }
  },
}));
