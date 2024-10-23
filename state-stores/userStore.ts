// import { create } from "zustand";

// interface User {
//   id: number;
//   name: string;
//   email: string;
// }

// interface UserState {
//   user: User | null;
//   update: (user: User) => void;
// }

// // export const useUserStore = create<UserState>((set) => ({
// //   user: null,
// //   update: (user) => set(() => ({ user })),
// // }));

// export const useUserStore = create<UserState>()((set) => ({
//   user: null,
//   update: (user) => set(() => ({ user: user })),
// }));
import { create } from "zustand";

// Define User type
type User = {
  id: string;
  name: string;
  email: string;
  pictureUrl: string;
};

type UserState = {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

// Create Zustand store for user
export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
