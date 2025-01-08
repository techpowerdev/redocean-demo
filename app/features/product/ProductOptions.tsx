"use client";

import { cn } from "@/lib/utils";
import { ProductVariantType } from "@/types/productTypes";
import { CircleCheckBig, X } from "lucide-react";
import React from "react";

type Props = {
  selectedOptions: Record<string, string | undefined>;
  productVariants: ProductVariantType[] | null | undefined;
  handleOptionChange: (key: string, value: string | undefined) => void;
  handleResetOptions: () => void; // เพิ่มฟังก์ชันสำหรับรีเซ็ต
};

export default function ProductOptions({
  productVariants,
  selectedOptions,
  handleOptionChange,
  handleResetOptions,
}: Props) {
  // ดึงตัวเลือกทั้งหมดจาก variantOptions
  const optionsMap: Record<string, Set<string>> = {};

  productVariants?.forEach((variant) => {
    Object.entries(variant.variantOptions).forEach(([key, value]) => {
      if (!optionsMap[key]) optionsMap[key] = new Set();
      optionsMap[key].add(value as string);
    });
  });

  // แปลง Set เป็น Array สำหรับการแสดงผล
  const options = Object.entries(optionsMap).map(([key, values]) => ({
    key,
    values: Array.from(values),
  }));

  // ฟังก์ชันกรองตัวเลือกที่สามารถเลือกได้
  const getFilteredOptions = (key: string): Set<string> => {
    const otherSelectedOptions = Object.entries(selectedOptions).reduce(
      (acc, [selectedKey, selectedValue]) => {
        if (selectedKey !== key && selectedValue) {
          acc[selectedKey] = selectedValue;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    // กรอง variant ที่ตรงกับตัวเลือกอื่น
    const activeVariants = productVariants?.filter((variant) =>
      Object.entries(otherSelectedOptions).every(
        ([selectedKey, selectedValue]) =>
          variant.variantOptions[selectedKey] === selectedValue
      )
    );

    // ดึงค่าที่เป็นไปได้สำหรับ key ปัจจุบัน
    const validValues = new Set<string>();
    activeVariants?.forEach((variant) => {
      if (variant.variantOptions[key]) {
        validValues.add(variant.variantOptions[key] as string);
      }
    });

    return validValues;
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <h1 className="relative text-xl font-semibold">ตัวเลือกสินค้า</h1>
        {/* ปุ่ม Reset */}
        <button
          onClick={handleResetOptions}
          className="flex gap-1 justify-center items-center text-xs px-2 py-1 border text-gray-700 bg-slate-100 rounded-full hover:border-red-500 hover:text-red-500"
        >
          ล้างการเลือก
          <X size={16} className="text-red-600" />
        </button>
      </div>
      {options.map((option) => {
        const filteredValues = getFilteredOptions(option.key);

        return (
          <div key={option.key}>
            <h2 className="font-semibold">{option.key} :</h2>
            <div>
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.key] === value;
                const isValid = filteredValues.has(value);

                // ฟังก์ชันแสดงปุ่มที่สามารถเลือกได้
                return (
                  <button
                    key={value}
                    onClick={() =>
                      handleOptionChange(
                        option.key,
                        isSelected ? undefined : value // toggle เลือก/ยกเลิก
                      )
                    }
                    className={cn(
                      "mx-1 my-2 relative",
                      "px-4 py-2 border border-gray-300 text-sm rounded-lg",
                      isSelected ? "bg-gray-600 text-white" : "bg-white",
                      isValid ? "cursor-pointer" : "cursor-not-allowed",
                      !isValid ? "bg-gray-200" : ""
                    )}
                    disabled={!isValid} // ปิดการใช้งานหากไม่เกี่ยวข้อง
                  >
                    {value}
                    {isSelected && (
                      <span className="absolute top-1 -right-1">
                        <CircleCheckBig size={14} className="text-green-500" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
