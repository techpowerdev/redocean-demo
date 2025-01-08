import { UserProfileType } from "@/types/userTypes";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// กำหนด type ของ state แต่ละตัว รวมถึง function ด้วย
export type State = {
  currentUser: UserProfileType | null;
  token: string | null;
};

export type Action = {
  setCurrentUser: (currentUser: UserProfileType) => void;
  setToken: (token: string | null) => void;
  clearCurrentUser: () => void;
};

/* สร้าง store โดยมี types ของ state ตามที่กำหนดไว้ โดยใช้ฟังก์ชั่น create จาก zustand พร้อมกับกำหนดค่า state เริ่มต้น

create<type>(callbackFunction)

callbackFunction = (set)=>({state: initialValue})
*/

// ใช้ middleware : devtools, persist เพื่อเก็บ state ไว้ใน localStorage เวลารีเฟสจะได้ไม่หาย
export const useCurrentUserStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        currentUser: null,
        token: null,
        loading: true,
        setCurrentUser: (user) => set(() => ({ currentUser: user })),
        setToken: (token) => set(() => ({ token: token })),

        // Action to clear the currentUser (logout)
        clearCurrentUser: () => set({ currentUser: null, token: null }),
      }),
      { name: "currentUser" }
    )
  )
);
