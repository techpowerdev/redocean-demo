import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// กำหนด type ของตัวแปร : currentUser
export type CurrentUser = {
  id: string;
  lineId?: string;
  displayName?: string | null;
  pictureUrl?: string | null;
  email?: string | null;
  fullName?: string | null;
  phoneNumber?: string | null;
  phoneVerified: boolean;
  readonly role: string;
};
// readonly => หลังกำหนดค่าแล้ว จะแก้ไขอีกไม่ได้
// ส่วน ? => ค่านั้นจะกำหนดหรือไม่ก็ได้

// กำหนด type ของ state แต่ละตัว รวมถึง function ด้วย
export type State = {
  currentUser: CurrentUser | null;
  token: string | null;
  loading: boolean;
};

export type Action = {
  setCurrentUser: (currentUser: CurrentUser) => void;
  setToken: (token: string) => void;
  clearCurrentUser: () => void;
  setLoading: (status: boolean) => void;
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
        setLoading: (status) => set({ loading: status }),
        setCurrentUser: (user) => set(() => ({ currentUser: user })),
        setToken: (token) => set(() => ({ token: token })),

        // Action to clear the currentUser (logout)
        clearCurrentUser: () => set({ currentUser: null, token: null }),
      }),
      { name: "currentUser" }
    )
  )
);
