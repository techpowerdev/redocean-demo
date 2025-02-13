import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AxiosError } from "axios";
import { CreateAddressParam, UpdateAddressParam } from "@/types/addressTypes";

import {
  changeActiveAddress,
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "@/services/addressServices";
import { Address } from "@/types/baseTypes";

// Utility to handle API errors
const handleApiError = (error: unknown, defaultMessage: string) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || defaultMessage;
  }
  return "เกิดข้อผิดพลาดบางอย่าง";
};

export type State = {
  addresses: Address[] | null;
  selectedAddress: Address | null;
};

export type Action = {
  setAddresses: (addresses: Address[]) => void;
  selectAddress: (address: Address) => void;
  createAddress: (address: CreateAddressParam) => Promise<void>;
  updateAddress: (id: string, address: UpdateAddressParam) => Promise<void>;
  changeActiveAddress: (id: string, isActive: boolean) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
};

export const useAddressStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        addresses: null,
        selectedAddress: null,

        setAddresses: (addressList) => set({ addresses: addressList }),

        selectAddress: (address) => set({ selectedAddress: address }),

        createAddress: async (address) => {
          try {
            const response = await createAddress(address);
            toast.success(response?.message || "เพิ่มที่อยู่ใหม่แล้ว");
            // await refreshAddresses(set);
            const updatedAddress = await getAddress().then((res) => res.data);
            set({ addresses: updatedAddress });
          } catch (error) {
            toast.error(handleApiError(error, "เพิ่มที่อยู่ไม่สำเร็จ"));
          }
        },

        updateAddress: async (id, address) => {
          try {
            const response = await updateAddress(id, address);
            toast.success(response?.message || "แก้ไขที่อยู่แล้ว");
            // await refreshAddresses(set);
            const updatedAddress = await getAddress().then((res) => res.data);
            set({ addresses: updatedAddress });
          } catch (error) {
            toast.error(handleApiError(error, "แก้ไขที่อยู่ไม่สำเร็จ"));
          }
        },

        changeActiveAddress: async (id, isActive) => {
          try {
            const response = await changeActiveAddress(id, isActive);
            set({ selectedAddress: response.data });
            toast.success(response?.message || "แก้ไขเป็นที่อยู่หลักแล้ว");
            const updatedAddress = await getAddress().then((res) => res.data);
            set({ addresses: updatedAddress });
          } catch (error) {
            toast.error(handleApiError(error, "แก้ไขที่อยู่ไม่สำเร็จ"));
          }
        },

        deleteAddress: async (id) => {
          try {
            const response = await deleteAddress(id);
            toast.success(response?.message || "ลบที่อยู่แล้ว");
            // await refreshAddresses(set);
            const updatedAddress = await getAddress().then((res) => res.data);
            set({ addresses: updatedAddress });
          } catch (error) {
            toast.error(handleApiError(error, "ลบที่อยู่ไม่สำเร็จ"));
          }
        },
      }),
      { name: "khumkha-address" }
    )
  )
);
