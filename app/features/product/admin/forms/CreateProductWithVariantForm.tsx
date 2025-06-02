"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const productSchema = z.object({
  options: z.array(
    z.object({
      name: z.string().min(1, "ตัวเลือกต้องมีชื่อ"),
      values: z.array(z.string().min(1)),
    })
  ),
  variants: z.array(
    z.object({
      attributes: z.record(z.string()),
      price: z.string().min(1, "ราคาต้องมีค่า"),
      stock: z.string().min(1, "คลังสินค้าต้องมีค่า"),
      sku: z.string().optional(),
    })
  ),
});

type ProductFormType = z.infer<typeof productSchema>;

export default function ProductForm() {
  const [bulkUpdate, setBulkUpdate] = useState({
    price: "",
    stock: "",
    sku: "",
  });

  const { register, control, handleSubmit, setValue } =
    useForm<ProductFormType>({
      resolver: zodResolver(productSchema),
      defaultValues: { options: [{ name: "", values: [] }], variants: [] },
    });

  const {
    fields: optionFields,
    append: addOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options",
  });

  const options = useWatch({ control, name: "options" });
  const variants = useWatch({ control, name: "variants" });

  // ฟังก์ชันสร้าง variants ตามตัวเลือกสินค้า
  const generateVariants = () => {
    const allCombinations = cartesianProduct(options.map((opt) => opt.values));
    setValue(
      "variants",
      allCombinations.map((comb) => ({
        attributes: options.reduce((acc, opt, index) => {
          acc[opt.name] = comb[index];
          return acc;
        }, {} as Record<string, string>),
        price: "",
        stock: "",
        sku: "",
      }))
    );
  };

  // ฟังก์ชันอัปเดตตารางทั้งหมดจากฟอร์มกลาง
  const updateAllVariants = () => {
    setValue(
      "variants",
      variants.map((variant) => ({
        ...variant,
        price: bulkUpdate.price || variant.price,
        stock: bulkUpdate.stock || variant.stock,
        sku: bulkUpdate.sku || variant.sku,
      }))
    );
  };

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={handleSubmit((data) => console.log(data))}>
        {/* ตัวเลือกสินค้า */}
        {optionFields.map((field, index) => (
          <div key={field.id} className="p-4 border rounded space-y-2">
            <Input
              {...register(`options.${index}.name`)}
              placeholder="ตัวเลือกสินค้า"
            />
            <div className="flex gap-2">
              <Input
                {...register(`options.${index}.values.0`)}
                placeholder="ตั้งค่า"
              />
              <Input
                {...register(`options.${index}.values.1`)}
                placeholder="ตั้งค่า"
              />
              <Button variant="destructive" onClick={() => removeOption(index)}>
                ลบ
              </Button>
            </div>
          </div>
        ))}
        <Button
          type="button"
          onClick={() => addOption({ name: "", values: [""] })}
        >
          เพิ่มตัวเลือก
        </Button>

        {/* สร้างตารางสินค้า */}
        <Button type="button" onClick={generateVariants} className="mt-4">
          สร้างรายการตัวเลือกสินค้า
        </Button>

        {/* ฟอร์มกลางสำหรับกรอกค่าพร้อมกัน */}
        <div className="p-4 border rounded space-y-2 mt-4">
          <h3 className="font-semibold">
            อัปเดตราคา / คลัง / SKU ของตัวเลือกทั้งหมด
          </h3>
          <div className="flex gap-2">
            <Input
              value={bulkUpdate.price}
              onChange={(e) =>
                setBulkUpdate({ ...bulkUpdate, price: e.target.value })
              }
              placeholder="ราคา"
            />
            <Input
              value={bulkUpdate.stock}
              onChange={(e) =>
                setBulkUpdate({ ...bulkUpdate, stock: e.target.value })
              }
              placeholder="คลัง"
            />
            <Input
              value={bulkUpdate.sku}
              onChange={(e) =>
                setBulkUpdate({ ...bulkUpdate, sku: e.target.value })
              }
              placeholder="SKU"
            />
            <Button type="button" onClick={updateAllVariants}>
              อัปเดตทั้งหมด
            </Button>
          </div>
        </div>

        {/* ตารางตัวเลือกสินค้า */}
        <table className="w-full mt-4 border border-gray-200 shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              {options.map((opt, index) => (
                <th
                  key={index}
                  className="px-4 py-2 border border-gray-200 text-center"
                >
                  {opt.name}
                </th>
              ))}
              <th className="px-4 py-2 border border-gray-200 text-center">
                ราคา
              </th>
              <th className="px-4 py-2 border border-gray-200 text-center">
                คลัง
              </th>
              <th className="px-4 py-2 border border-gray-200 text-center">
                SKU
              </th>
            </tr>
          </thead>
          <tbody>
            {mergeVariants(variants).map((row, rowIndex) => (
              <tr key={rowIndex} className={`border border-gray-200`}>
                {row.showMain && (
                  <td
                    rowSpan={row.rowSpan}
                    className="px-4 py-2 border border-gray-200 text-center align-middle"
                  >
                    {row.mainKey}
                  </td>
                )}
                <td className="px-4 py-2 border border-gray-200 text-center align-middle">
                  {row.subKey}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center align-middle">
                  <Input {...register(`variants.${row.originalIndex}.price`)} />
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center align-middle">
                  <Input {...register(`variants.${row.originalIndex}.stock`)} />
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center align-middle">
                  <Input {...register(`variants.${row.originalIndex}.sku`)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Button type="submit" className="mt-4">
          บันทึกสินค้า
        </Button>
      </form>
    </div>
  );
}

// ฟังก์ชันสร้าง combinations ของตัวเลือกสินค้า
function cartesianProduct(arrays: string[][]): string[][] {
  return arrays.reduce((a, b) => a.flatMap((d) => b.map((e) => [...d, e])), [
    [],
  ] as string[][]);
}

// ฟังก์ชันรวมแถวตามตัวเลือกหลัก
// เช่น สี และ ขนาด
// ถ้าสีเดียวกันแต่ขนาดต่างกัน จะรวมแถว
// ถ้าสีและขนาดต่างกัน จะไม่รวมแถว
type Variant = {
  attributes: Record<string, string>;
  price: string;
  stock: string;
  sku?: string;
};

function mergeVariants(variants: Variant[]) {
  if (variants.length === 0) return [];

  // หาตัวเลือก (attribute) ทั้งหมดจากตัวอย่างแรก
  const keys = Object.keys(variants[0].attributes);

  // ใช้ key แรกในการจัดกลุ่ม (เช่น สี)
  const mainKey = keys[0];
  const subKey = keys[1]; // เช่น ขนาด (หรืออาจไม่มีเลย)

  const mergedRows: {
    mainKey: string;
    subKey: string | null;
    originalIndex: number;
    showMain: boolean;
    rowSpan: number;
  }[] = [];

  const mainKeyCount: Record<string, number> = {};
  const mainKeyIndex: Record<string, number> = {};

  variants.forEach((variant, index) => {
    const mainValue = variant.attributes[mainKey];
    const subValue = subKey ? variant.attributes[subKey] : null;

    if (!mainKeyCount[mainValue]) {
      mainKeyCount[mainValue] = 0;
      mainKeyIndex[mainValue] = mergedRows.length;
    }

    mainKeyCount[mainValue]++;

    mergedRows.push({
      mainKey: mainValue,
      subKey: subValue,
      originalIndex: index,
      showMain: mainKeyCount[mainValue] === 1,
      rowSpan: 1,
    });
  });

  Object.keys(mainKeyIndex).forEach((value) => {
    mergedRows[mainKeyIndex[value]].rowSpan = mainKeyCount[value];
  });

  return mergedRows;
}
