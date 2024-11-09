import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type OrderType = {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  selectedImg: SelectedImgType; // object type
  // images: SelectedImgType; // object type
  quantity: number;
  price: number;
};

export type SelectedImgType = {
  color: string;
  colorCode: string;
  image: string;
};

export type State = {
  orders: OrderType[] | null;
  loading: boolean;
};

export type Action = {
  setOrders: (order: OrderType[] | null) => void;
  clearOrder: () => void;
  setLoading: (status: boolean) => void;
};

/* สร้าง store โดยมี types ของ state ตามที่กำหนดไว้ โดยใช้ฟังก์ชั่น create จาก zustand พร้อมกับกำหนดค่า state เริ่มต้น

create<type>(callbackFunction)

callbackFunction = (set)=>({state: initialValue})
*/

// ใช้ middleware : devtools, persist เพื่อเก็บ state ไว้ใน localStorage เวลารีเฟสจะได้ไม่หาย
export const useOrderStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        orders: null,
        loading: true,
        setLoading: (status) => set({ loading: status }),
        setOrders: (orders) => set(() => ({ orders: orders })),
        clearOrder: () => set({ orders: null }),
      }),
      { name: "orders" }
    )
  )
);
