import { create } from "zustand";

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
type State = {
  currentUser: CurrentUser | null;
  loading: boolean;
  error: string | null;
};

type Action = {
  setCurrentUser: (currentUser: CurrentUser) => void;
  clearCurrentUser: () => void;
};

/* สร้าง store โดยมี types ของ state ตามที่กำหนดไว้ โดยใช้ฟังก์ชั่น create จาก zustand พร้อมกับกำหนดค่า state เริ่มต้น

create<type>(callbackFunction)

callbackFunction = (set)=>({state: initialValue})
*/

export const useUserStore = create<State & Action>((set) => ({
  currentUser: null,
  loading: true,
  error: null,
  setCurrentUser: (currentUser: CurrentUser) => {
    localStorage.setItem("ShopCartItems", JSON.stringify(currentUser));
  },

  // Action to clear the currentUser (logout)
  clearCurrentUser: () => {
    set({ currentUser: null });
    localStorage.removeItem("LoggedInUser");
  },
}));
