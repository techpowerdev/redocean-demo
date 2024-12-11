// import toast from "react-hot-toast";
// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";
// import { AxiosError } from "axios";
// import {
//   AddressType,
//   CreateAddressType,
//   UpdateAddressType,
// } from "@/types/addressTypes";
// import {
//   changeActiveAddress,
//   createAddress,
//   deleteAddress,
//   getAddress,
//   updateAddress,
// } from "@/services/addressServices";

// export type State = {
//   addresses: AddressType[] | null;
//   selectedAddress: AddressType | null;
// };

// export type Action = {
//   setAddresses: (addresses: AddressType[]) => void;
//   selectAddress: (address: AddressType) => void;
//   createAddress: (token: string, address: CreateAddressType) => void;
//   updateAddress: (
//     token: string,
//     id: string,
//     address: UpdateAddressType
//   ) => void;
//   changeActiveAddress: (token: string, id: string, isActive: boolean) => void;
//   deleteAddress: (token: string, id: string) => void;
// };

// export const useAddressStore = create<State & Action>()(
//   devtools(
//     persist(
//       (set) => ({
//         addresses: null,
//         selectedAddress: null,
//         setAddresses: (addressList) => set({ addresses: addressList }),
//         selectAddress: (address) => set({ selectedAddress: address }),
//         createAddress: async (token, address) => {
//           try {
//             const response = await createAddress(token, address);
//             toast.success(response?.message || "เพิ่มที่อยู่ใหม่แล้ว");
//             const updatedAddress = await getAddress(token).then(
//               (res) => res.data
//             );
//             set({ addresses: updatedAddress });
//           } catch (error) {
//             if (error instanceof AxiosError) {
//               const errorMessage =
//                 error.response?.data?.message || "เพิ่มที่อยู่ไม่สำเร็จ";
//               toast.error(errorMessage);
//             } else {
//               toast.error("เกิดข้อผิดพลาดบางอย่าง");
//             }
//           }
//         },
//         updateAddress: async (token, id, address) => {
//           try {
//             const response = await updateAddress(token, id, address);
//             toast.success(response?.message || "แก้ไขที่อยู่แล้ว");
//             const updatedAddress = await getAddress(token).then(
//               (res) => res.data
//             );
//             set({ addresses: updatedAddress });
//           } catch (error) {
//             if (error instanceof AxiosError) {
//               const errorMessage =
//                 error.response?.data?.message || "แก้ไขที่อยู่ไม่สำเร็จ";
//               toast.error(errorMessage);
//             } else {
//               toast.error("เกิดข้อผิดพลาดบางอย่าง");
//             }
//           }
//         },
//         changeActiveAddress: async (token, id, isActive) => {
//           try {
//             const response = await changeActiveAddress(token, id, isActive);
//             toast.success(response?.message || "แก้ไขเป็นที่อยู่หลักแล้ว");
//             const updatedAddress = await getAddress(token).then(
//               (res) => res.data
//             );
//             set({ addresses: updatedAddress });
//           } catch (error) {
//             if (error instanceof AxiosError) {
//               const errorMessage =
//                 error.response?.data?.message || "แก้ไขที่อยู่ไม่สำเร็จ";
//               toast.error(errorMessage);
//             } else {
//               toast.error("เกิดข้อผิดพลาดบางอย่าง");
//             }
//           }
//         },
//         deleteAddress: async (token, id) => {
//           try {
//             const response = await deleteAddress(token, id);
//             toast.success(response?.message || "ลบที่อยู่แล้ว");
//             const updatedAddress = await getAddress(token).then(
//               (res) => res.data
//             );
//             set({ addresses: updatedAddress });
//           } catch (error) {
//             if (error instanceof AxiosError) {
//               const errorMessage =
//                 error.response?.data?.message || "ลบที่อยู่ไม่สำเร็จ";
//               toast.error(errorMessage);
//             } else {
//               toast.error("เกิดข้อผิดพลาดบางอย่าง");
//             }
//           }
//         },
//       }),
//       { name: "khumkha-address" }
//     )
//   )
// );

// version 2
import toast from "react-hot-toast";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AxiosError } from "axios";
import {
  AddressType,
  CreateAddressType,
  UpdateAddressType,
} from "@/types/addressTypes";

import {
  changeActiveAddress,
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "@/services/addressServices";

// Utility to handle API errors
const handleApiError = (error: unknown, defaultMessage: string) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || defaultMessage;
  }
  return "เกิดข้อผิดพลาดบางอย่าง";
};

// Utility to refresh addresses
const refreshAddresses = async (token: string, set: any) => {
  try {
    const updatedAddress = await getAddress(token).then((res) => res.data);
    set({ addresses: updatedAddress });
  } catch (error) {
    toast.error("ไม่สามารถโหลดข้อมูลที่อยู่ได้");
  }
};

export type State = {
  addresses: AddressType[] | null;
  selectedAddress: AddressType | null;
};

export type Action = {
  setAddresses: (addresses: AddressType[]) => void;
  selectAddress: (address: AddressType) => void;
  createAddress: (token: string, address: CreateAddressType) => Promise<void>;
  updateAddress: (
    token: string,
    id: string,
    address: UpdateAddressType
  ) => Promise<void>;
  changeActiveAddress: (
    token: string,
    id: string,
    isActive: boolean
  ) => Promise<void>;
  deleteAddress: (token: string, id: string) => Promise<void>;
};

export const useAddressStore = create<State & Action>()(
  devtools(
    persist(
      (set) => ({
        addresses: null,
        selectedAddress: null,

        setAddresses: (addressList) => set({ addresses: addressList }),

        selectAddress: (address) => set({ selectedAddress: address }),

        createAddress: async (token, address) => {
          try {
            const response = await createAddress(token, address);
            toast.success(response?.message || "เพิ่มที่อยู่ใหม่แล้ว");
            // await refreshAddresses(token, set);
            const updatedAddress = await getAddress(token).then(
              (res) => res.data
            );
            set({ addresses: updatedAddress });
          } catch (error) {
            toast.error(handleApiError(error, "เพิ่มที่อยู่ไม่สำเร็จ"));
          }
        },

        updateAddress: async (token, id, address) => {
          try {
            const response = await updateAddress(token, id, address);
            toast.success(response?.message || "แก้ไขที่อยู่แล้ว");
            // await refreshAddresses(token, set);
            const updatedAddress = await getAddress(token).then(
              (res) => res.data
            );
            set({ addresses: updatedAddress });
          } catch (error) {
            toast.error(handleApiError(error, "แก้ไขที่อยู่ไม่สำเร็จ"));
          }
        },

        changeActiveAddress: async (token, id, isActive) => {
          try {
            const response = await changeActiveAddress(token, id, isActive);
            toast.success(response?.message || "แก้ไขเป็นที่อยู่หลักแล้ว");
            // await refreshAddresses(token, set);
            const updatedAddress = await getAddress(token).then(
              (res) => res.data
            );
            set({ addresses: updatedAddress });
          } catch (error) {
            toast.error(handleApiError(error, "แก้ไขที่อยู่ไม่สำเร็จ"));
          }
        },

        deleteAddress: async (token, id) => {
          try {
            const response = await deleteAddress(token, id);
            toast.success(response?.message || "ลบที่อยู่แล้ว");
            // await refreshAddresses(token, set);
            const updatedAddress = await getAddress(token).then(
              (res) => res.data
            );
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
