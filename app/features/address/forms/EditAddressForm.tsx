"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import toast from "react-hot-toast";
import axios from "axios";
import { Edit } from "lucide-react";
import Loading from "@/components/shared/Loading";
import { useAddressStore } from "@/state-stores/addressStore";
import { Address } from "@/types/baseTypes";

// Dynamically import the typeahead components
const ThailandAddressTypeahead = dynamic(
  () =>
    import("react-thailand-address-typeahead").then(
      (mod) => mod.ThailandAddressTypeahead
    ),
  { ssr: false }
);
const SubdistrictInput = dynamic(
  () =>
    import("react-thailand-address-typeahead").then(
      (mod) => mod.SubdistrictInput
    ),
  { ssr: false }
);
const DistrictInput = dynamic(
  () =>
    import("react-thailand-address-typeahead").then((mod) => mod.DistrictInput),
  { ssr: false }
);
const ProvinceInput = dynamic(
  () =>
    import("react-thailand-address-typeahead").then((mod) => mod.ProvinceInput),
  { ssr: false }
);
const PostalCodeInput = dynamic(
  () =>
    import("react-thailand-address-typeahead").then(
      (mod) => mod.PostalCodeInput
    ),
  { ssr: false }
);
const Suggestion = dynamic(
  () =>
    import("react-thailand-address-typeahead").then((mod) => mod.Suggestion),
  { ssr: false }
);

const AddressSchema = z.object({
  recipient: z
    .string()
    .min(1, "กรุณากรอกชื่อผู้รับ")
    .refine((value) => value.trim() !== "", "กรุณากรอกชื่อผู้รับ"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^0[0-9]{9}$/, "กรุณากรอกเบอร์โทร"),
  address: z
    .string()
    .min(1, "กรุณากรอกที่อยู่")
    .refine((value) => value.trim() !== "", "กรุณากรอกที่อยู่"),
  street: z.string().optional(),
  subdistrict: z
    .string()
    .min(1, "กรุณากรอกตำบล / แขวง")
    .refine((value) => value.trim() !== "", "กรุณากรอกตำบล / แขวง"),
  district: z
    .string()
    .min(1, "กรุณากรอกอำเภอ / เขต")
    .refine((value) => value.trim() !== "", "กรุณากรอกอำเภอ / เขต"),
  province: z
    .string()
    .min(1, "กรุณากรอกจังหวัด")
    .refine((value) => value.trim() !== "", "กรุณากรอกจังหวัด"),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก")
    .refine((value) => value.trim() !== "", "กรุณากรอกรหัสไปรษณีย์"),
  isActive: z.boolean().default(false).optional(),
});

type Props = {
  address: Address;
};
export default function EditAddressForm({ address }: Props) {
  // global state
  const updateAddress = useAddressStore((state) => state.updateAddress);

  // local state
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะของ Sheet

  const [val, setVal] = useState({
    recipient: address.recipient,
    phoneNumber: address.phoneNumber,
    address: address.address,
    street: address.street,
    subdistrict: address.subDistrict,
    district: address.district,
    province: address.province,
    postalCode: address.postalCode,
    isActive: address.isActive,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      AddressSchema.parse(val); // Validate form values
      setErrors({}); // Clear errors if valid

      setLoading(true);

      const formData = {
        recipient: val.recipient,
        phoneNumber: val.phoneNumber,
        address: val.address,
        street: val.street,
        subDistrict: val.subdistrict,
        district: val.district,
        province: val.province,
        postalCode: val.postalCode,
        isActive: val.isActive,
      };

      updateAddress(address.id, formData);

      setIsOpen(false); // ปิด Sheet เมื่อบันทึกสำเร็จ
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages: Record<string, string> = {};
        error.errors.forEach((e) => {
          if (e.path[0]) {
            errorMessages[e.path[0]] = e.message;
          }
        });
        setErrors(errorMessages);
      }

      if (axios.isAxiosError(error)) {
        if (error.response?.data.message) {
          toast.error(error.response?.data.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Edit size={16} onClick={() => setIsOpen(true)} />
      </SheetTrigger>
      <SheetContent className="w-full md:w-[540px]">
        <SheetHeader>
          <SheetTitle>แก้ไขที่อยู่</SheetTitle>
          <SheetDescription>กรอกข้อมูลที่อยู่ให้ครบถ้วน</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 my-2">
          <ThailandAddressTypeahead
            value={val}
            onValueChange={(updatedValue) => {
              setVal((prev) => ({
                ...prev,
                subdistrict: updatedValue.subdistrict,
                district: updatedValue.district,
                province: updatedValue.province,
                postalCode: updatedValue.postalCode,
              }));
            }}
          >
            <div className="space-y-4">
              <input
                type="text"
                placeholder="ชื่อผู้รับ"
                className="w-full p-2 border rounded-sm"
                value={val.recipient}
                onChange={(e) => setVal({ ...val, recipient: e.target.value })}
              />
              {errors.recipient && (
                <p className="text-red-500 text-sm">{errors.recipient}</p>
              )}
              <input
                type="text"
                placeholder="เบอร์โทรผู้รับ"
                className="w-full p-2 border rounded-sm"
                value={val.phoneNumber}
                onChange={(e) =>
                  setVal({ ...val, phoneNumber: e.target.value })
                }
              />
              {errors.phoneNumber && (
                <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
              )}
              <input
                type="text"
                placeholder="ที่อยู่ / อาคาร"
                className="w-full p-2 border rounded-sm"
                value={val.address}
                onChange={(e) => setVal({ ...val, address: e.target.value })}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
              <input
                type="text"
                placeholder="ถนน / ซอย"
                className="w-full p-2 border rounded-sm"
                value={val.street || ""}
                onChange={(e) => setVal({ ...val, street: e.target.value })}
              />
              <SubdistrictInput
                placeholder="ตำบล / แขวง"
                className="w-full p-2 border rounded-sm"
              />
              {errors.subdistrict && (
                <p className="text-red-500 text-sm">{errors.subdistrict}</p>
              )}
              <DistrictInput
                placeholder="อำเภอ / เขต"
                className="w-full p-2 border rounded-sm"
              />
              {errors.district && (
                <p className="text-red-500 text-sm">{errors.district}</p>
              )}
              <ProvinceInput
                placeholder="จังหวัด"
                className="w-full p-2 border rounded-sm"
              />
              {errors.province && (
                <p className="text-red-500 text-sm">{errors.province}</p>
              )}
              <PostalCodeInput
                placeholder="รหัสไปรษณีย์"
                className="w-full p-2 border rounded-sm"
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm">{errors.postalCode}</p>
              )}
              <Suggestion
                // containerProps={{ className: "flex flex-col mt-2" }}
                containerProps={{
                  className:
                    "flex flex-col border rounded-sm shadow-md mt-1 divide-y",
                }}
                optionItemProps={{
                  className: "cursor-pointer p-2 hover:bg-slate-100",
                }}
              />
              <label className="flex justify-start items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={val.isActive}
                  onChange={(e) =>
                    setVal({ ...val, isActive: e.target.checked })
                  }
                  className="h-4 w-4 accent-primary"
                />
                ตั้งเป็นที่อยู่หลัก
              </label>
            </div>
          </ThailandAddressTypeahead>
          <Button disabled={loading} type="submit" className="w-full">
            {loading ? <Loading /> : "บันทึก"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
