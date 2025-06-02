"use client";

import { useCallback, useEffect, useState } from "react";
import { useFieldArray, UseFormReturn, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Trash2, GripVertical, Plus } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import ImageUploadForm from "@/app/features/image/ImageUploadForm";
import { CreateProductWithVariants } from "@/app/(admin)/admin/product/create/CreateProductWithVariantsForm";

type Props = {
  form: UseFormReturn<CreateProductWithVariants>; // รับจาก form หลักมา
};

export default function NestedCreateProductVariantField({ form }: Props) {
  const { control, watch, setValue, getValues } = form;

  // Set up field arrays for dynamic fields
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options",
  });

  // State for bulk update inputs
  const [bulkUpdate, setBulkUpdate] = useState({
    originalPrice: 0,
    stock: 0,
    sku: "",
  });

  // Watch for changes
  const hasVariants = watch("hasVariants");
  const options = watch("options");
  const variations = watch("variations");

  // Generate variations based on all options
  const generateVariations = useCallback(() => {
    const currentOptions = getValues("options");
    const currentVariations = getValues("variations");

    if (!currentOptions || currentOptions.length === 0) return;

    // Get non-empty values for each option and return only id,value and tierIndex
    const optionValues = currentOptions.map((option) =>
      (option?.values || [])
        .filter((item) => item && item.value !== "")
        .map((item, index) => ({
          optionId: item.optionId,
          value: item.value,
          tierIndex: index,
          image: item.image,
        }))
    );

    // Skip if any option has no values
    if (optionValues.some((values) => !values || values.length === 0)) return;

    // Generate all combinations
    const combinations = generateCombinations(optionValues);

    // Create variations from combinations
    const newVariations = combinations.map((combo) => {
      // ใช้ tierIndex เป็นอาร์เรย์โดยตรง ไม่ต้อง join
      const tierIndexs = combo.map((item) => item.tierIndex);
      const values = combo.map((item) => item.value);
      const vName = values.join(",");
      const valueIds = combo.map((item) => item.optionId);
      const key = valueIds.join("-");
      const vImage = combo?.[0].image;

      // Find existing variation or create new one
      const existingVariation = currentVariations.find((v) => {
        if (v && v.key) {
          return v.key === key;
        }
      });

      if (existingVariation) {
        return {
          ...existingVariation,
          tierIndex: tierIndexs,
          name: vName || "",
          image: vImage,
          originalPrice: existingVariation.originalPrice || 0,
          stock: existingVariation.stock || 0,
          sku: existingVariation.sku || "",
          id: existingVariation.id || "0", // Ensure 'id' is present (model id)
        };
      } else {
        return {
          key: key,
          tierIndex: tierIndexs,
          name: vName,
          image: vImage,
          originalPrice: 0,
          stock: 0,
          sku: "",
          id: "0", // Assign default 'id' (model id)
        };
      }
    });

    // Update variations
    setValue("variations", newVariations);
  }, [getValues, setValue]);

  // Apply bulk values to all variations
  const applyBulkValues = () => {
    const currentVariations = getValues("variations") || [];
    if (currentVariations.length === 0) return;

    const updatedVariations = currentVariations.map((variation) => {
      return {
        ...variation,
        originalPrice:
          bulkUpdate.originalPrice !== 0
            ? bulkUpdate.originalPrice
            : variation.originalPrice || 0,
        stock: bulkUpdate.stock !== 0 ? bulkUpdate.stock : variation.stock || 0,
        sku: bulkUpdate.sku !== "" ? bulkUpdate.sku : variation.sku || "",
      };
    });

    // setValue("variations", updatedVariations)
    // อัปเดตค่าแต่ละรายการแยกกัน เพื่อให้ React Hook Form รับรู้การเปลี่ยนแปลง
    updatedVariations.forEach((variation, index) => {
      setValue(`variations.${index}.originalPrice`, variation.originalPrice);
      setValue(`variations.${index}.stock`, variation.stock);
      setValue(`variations.${index}.sku`, variation.sku);
    });
  };

  // Add a new option
  const addOption = () => {
    if (optionFields.length < 3) {
      const newOption = {
        name: `ตัวเลือก ${optionFields.length + 1}`,
        values: [
          {
            optionId: `${Date.now()}${Math.random()}`,
            value: "",
            image: optionFields.length === 0 ? "" : undefined,
          },
        ],
      };

      appendOption(newOption);

      // Generate variations
      generateVariations();
    }
  };

  const openHasVariants = () => {
    setValue("hasVariants", true);
    if (optionFields.length === 0) {
      addOption();
    }
  };

  useEffect(() => {
    generateVariations();
    console.log("All options:", options);
  }, [options, generateVariations]);

  return (
    <div className="w-full">
      <h1 className="text-xl font-medium text-gray-800 my-6">ข้อมูลตัวเลือก</h1>
      {/* {JSON.stringify(variations)} */}
      {!hasVariants ? (
        optionFields.length === 0 && (
          <Button type="button" variant={"secondary"} onClick={openHasVariants}>
            <Plus className="w-4 h-4" />
            <span>เปิดใช้งานตัวเลือกสินค้า</span>
          </Button>
        )
      ) : (
        <>
          <div className="mb-8">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                <span className="text-gray-700">ตัวเลือกสินค้า</span>
              </div>
              {optionFields.length < 3 && (
                <Button type="button" onClick={addOption}>
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มตัวเลือก</span>
                </Button>
              )}
            </div>

            {/* Options */}
            {optionFields.map((option, optionIndex) => {
              return (
                <OptionBlock
                  key={option.id}
                  optionFields={optionFields}
                  form={form}
                  optionIndex={optionIndex}
                  removeOption={removeOption}
                  generateVariations={generateVariations}
                />
              );
            })}
          </div>
          {/* Bulk update section */}
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="col-span-4 md:col-span-1">
                  <h3 className="text-sm font-medium mb-2">
                    กรอกค่าสำหรับทุกรายการ
                  </h3>
                </div>
                <div className="col-span-4 md:col-span-3 grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      ราคา
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        ฿
                      </span>
                      <Input
                        type="number"
                        min={0}
                        value={bulkUpdate.originalPrice}
                        onChange={(e) =>
                          setBulkUpdate({
                            ...bulkUpdate,
                            originalPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="ใส่ราคา"
                        className={`pl-8 border-gray-300`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      คลัง
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={bulkUpdate.stock}
                      onChange={(e) =>
                        setBulkUpdate({
                          ...bulkUpdate,
                          stock: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="ใส่จำนวน"
                      className={`border-gray-300`}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-500 mb-1 block">
                      เลข SKU
                    </label>
                    <Input
                      value={bulkUpdate.sku}
                      onChange={(e) =>
                        setBulkUpdate({ ...bulkUpdate, sku: e.target.value })
                      }
                      placeholder="ใส่เลข SKU"
                      className={`border-gray-300`}
                    />
                  </div>
                </div>
                <div className="col-span-4 flex justify-end mt-2">
                  <Button type="button" onClick={applyBulkValues}>
                    นำไปใช้กับสินค้าทั้งหมด
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product variations table */}
          <div className="text-gray-700 my-5">รายการตัวเลือกสินค้า</div>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full border border-gray-200 text-sm">
              {/* Table header */}
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="p-3 text-left font-medium border-r border-gray-200">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-gray-700">ตัวเลือกสินค้า</span>
                    </div>
                  </th>
                  <th className="p-3 text-left font-medium border-r border-gray-200">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-1">*</span>
                      <span className="text-gray-700">ราคา</span>
                    </div>
                  </th>
                  <th className="p-3 text-left font-medium border-r border-gray-200">
                    <div className="flex items-center">
                      <span className="text-red-500 mr-1">*</span>
                      <span className="text-gray-700">คลัง</span>
                    </div>
                  </th>
                  <th className="p-3 text-left font-medium">
                    <span className="text-gray-700">เลข SKU</span>
                  </th>
                </tr>
              </thead>

              {/* Table body */}
              <tbody className="divide-y divide-gray-200">
                {variations.map((variation, variationIndex) => (
                  <tr key={variationIndex}>
                    <td className="p-3 border-r border-gray-200">
                      {variation.name}
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <FormField
                        control={control}
                        name={`variations.${variationIndex}.originalPrice`}
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={0}
                                placeholder="ใส่ค่า"
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="absolute -bottom-6" />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="p-3 border-r border-gray-200">
                      <FormField
                        control={control}
                        name={`variations.${variationIndex}.stock`}
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                min={0}
                                placeholder="ใส่ค่า"
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="absolute -bottom-6" />
                          </FormItem>
                        )}
                      />
                    </td>
                    <td className="px-3 py-6">
                      <FormField
                        control={control}
                        name={`variations.${variationIndex}.sku`}
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="ใส่ค่า"
                                className="border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="absolute -bottom-6" />
                          </FormItem>
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function OptionBlock({
  optionFields,
  form,
  optionIndex,
  removeOption,
  generateVariations,
}: {
  optionFields: Option[];
  form: UseFormReturn<CreateProductWithVariants>;
  optionIndex: number;
  removeOption: (index: number) => void;
  generateVariations: () => void;
}) {
  const { control, getValues, setValue } = form;

  const {
    fields: valueFields,
    append: appendValue,
    remove: removeValue,
    move,
  } = useFieldArray({
    control,
    name: `options.${optionIndex}.values`,
  });

  // อ่านค่าจาก form ใน component หลัก ที่ใน component ลูก รับ control ผ่าน props มา
  const watchedOptions = useWatch({
    control,
    name: `options.${optionIndex}.values`, // path ใน form ที่ต้องการอ่านค่า
  });

  // Drag and drop handlers
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);

  const handleDragStart = (valueIndex: number) => {
    setDraggedItem(valueIndex);
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    valueIndex: number
  ) => {
    e.preventDefault();
    setDragOverItem(valueIndex);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (draggedItem !== null && dragOverItem !== null) {
      move(draggedItem, dragOverItem);
    }
  };

  // ฟังก์ชัน handleDragEnd เพื่อให้รีเซ็ต state หลังจากการลากและวางเสร็จสิ้น
  const handleDragEnd = () => {
    // ใช้ setTimeout เพื่อให้แน่ใจว่า handleDrop ทำงานเสร็จก่อน
    setTimeout(() => {
      setDraggedItem(null);
      setDragOverItem(null);
      generateVariations();
    }, 50);
  };

  const checkAndAddEmptyField = (optionIndex: number) => {
    const option = getValues(`options.${optionIndex}`);
    if (!option?.values || option.values.length === 0) {
      const newValue = {
        optionId: `${Date.now()}${Math.random()}`,
        value: "",
        image: optionIndex === 0 ? "" : undefined,
      };
      appendValue(newValue);
    }

    const values = [...option.values];
    const lastValue = values[values.length - 1];

    // Only add a new field if the last field is not empty
    if (lastValue && lastValue.value !== "") {
      const newValue = {
        optionId: `${Date.now()}${Math.random()}`,
        value: "",
        image: optionIndex === 0 ? "" : undefined,
      };
      appendValue(newValue);
    }

    generateVariations();
  };

  // ติดตามทุกการเปลี่ยนแปลงของ option แต่ละตัว
  // เพื่อให้แน่ใจว่ามีการสร้าง variations ใหม่ทุกครั้งที่มีการเปลี่ยนแปลง
  useEffect(() => {
    generateVariations();
  }, [watchedOptions, generateVariations]);

  return (
    <div className="bg-gray-50 p-4 rounded-md mb-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center mb-5">
            <span className="text-gray-700 mr-2">
              ตัวเลือกสินค้า{optionIndex + 1}
            </span>
            <FormField
              control={control}
              name={`options.${optionIndex}.name`}
              render={({ field }) => (
                <FormItem className="relative">
                  <FormControl>
                    <div className="relative w-40">
                      <Input {...field} className={`pr-16 border-gray-300`} />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        {`${field.value?.length || 0}/14`}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="absolute -bottom-6" />
                </FormItem>
              )}
            />
          </div>
        </div>
        <button
          type="button"
          className="text-gray-500"
          onClick={() => {
            removeOption(optionIndex);
            if (optionFields.length <= 1) {
              setValue("hasVariants", false);
              setValue("options", []);
              setValue("variations", []);
            }
            generateVariations();
          }}
          // disabled={optionFields.length <= 1}
        >
          <X
            className={`w-5 h-5 ${
              optionFields.length <= 1 ? "opacity-30" : ""
            }`}
          />
        </button>
      </div>
      <div className="flex gap-6 flex-wrap py-2">
        {valueFields.map((value, valueIndex) => (
          <div
            key={value.id}
            className={`relative flex items-center ${
              dragOverItem && dragOverItem === valueIndex ? "bg-gray-100" : ""
            }`}
            draggable={
              getValues(`options.${optionIndex}.values.${valueIndex}.value`) !==
              ""
            }
            onDragStart={() => handleDragStart(valueIndex)}
            onDragOver={(e) => handleDragOver(e, valueIndex)}
            onDrop={(e) => handleDrop(e)}
            onDragEnd={handleDragEnd}
          >
            {getValues(`options.${optionIndex}.values.${valueIndex}.value`) !==
              "" && (
              <div className="mr-2 cursor-move">
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <div className="relative flex-1 flex flex-col items-center gap-2">
              {optionIndex === 0 && (
                <FormField
                  control={control}
                  name={`options.${optionIndex}.values.${valueIndex}.image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
                          <ImageUploadForm field={field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={control}
                name={`options.${optionIndex}.values.${valueIndex}.value`}
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          placeholder="ตั้งค่า"
                          className={`pr-16 border-gray-300`}
                          value={field.value || ""}
                          onChange={(e) => {
                            field.onChange(e); // ให้เปลี่ยนแปลงค่าได้
                            generateVariations();
                          }}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                          {`${field.value?.length || 0}/20`}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="absolute -bottom-6" />
                  </FormItem>
                )}
              />
            </div>

            <button
              type="button"
              className="text-gray-400 ml-2"
              onClick={() => {
                removeValue(valueIndex);
                generateVariations();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        <div className="w-full flex items- justify-center">
          <Button
            type="button"
            onClick={() => checkAndAddEmptyField(optionIndex)}
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มค่า</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * ฟังก์ชันเพื่อสร้าง combinations ของค่าทั้งหมดจาก arrays หลายชุด
 * เช่น [['ดำ', 'ขาว'], ['M', 'L']] → [['ดำ','M'], ['ดำ','L'], ['ขาว','M'], ['ขาว','L']]
 *
 * @param arrays - อาร์เรย์หลักที่เก็บอาร์เรย์ย่อยของค่าที่ต้องการจับคู่กัน
 * @param current - ค่าที่กำลังสะสมอยู่ในแต่ละรอบของ recursion (default: [])
 * @param index - ตำแหน่งของ array ที่กำลังประมวลผลอยู่ในขณะนั้น (default: 0)
 * @returns อาร์เรย์ของ combinations แต่ละชุด
 */
function generateCombinations<T>(
  arrays: T[][], // Array ของ Array ที่เก็บค่าทั่วไป เช่น string[][], number[][], object[][]
  current: T[] = [], // ค่าที่กำลังสะสมระหว่าง recursive
  index: number = 0 // index ของ array ปัจจุบันที่กำลังประมวลผล
): T[][] {
  // base case: ถ้าทำครบทุกระดับแล้ว → คืนค่าชุด combination ที่สร้างเสร็จ
  if (index === arrays.length) {
    return [current];
  }

  let result: T[][] = []; // เก็บผลลัพธ์ทั้งหมดที่สร้างได้ในรอบนี้

  // loop ผ่านแต่ละค่าของระดับปัจจุบัน
  for (let i = 0; i < arrays[index].length; i++) {
    // เรียก recursive ต่อไปที่ระดับถัดไป พร้อมกับเพิ่มค่าปัจจุบันเข้า current
    result = result.concat(
      generateCombinations(
        arrays, // ข้อมูลทั้งหมด
        [...current, arrays[index][i]], // เพิ่มค่าล่าสุดเข้า current
        index + 1 // ไปยังระดับถัดไป
      )
    );
  }

  return result; // คืนค่าผลลัพธ์ที่รวมได้ทั้งหมด
}

export type OptionValue = {
  optionId: string;
  value: string;
  image?: string | undefined;
};

export type Option = {
  name: string;
  values: OptionValue[];
};

export type Variation = {
  id?: string | undefined;
  name: string;
  tierIndex: number[];
  originalPrice: number;
  stock: number;
  sku?: string | undefined;
};

type RenderRowsProps = {
  options: Option[];
  form: UseFormReturn<CreateProductWithVariants>;
  findVariation: (tierIndex: number[]) => number;
  findOptionValueIndex: (colIndex: number, value: string) => number;
};

export function renderRows({
  options,
  form,
  findVariation,
  findOptionValueIndex,
}: RenderRowsProps): JSX.Element[] | null {
  const { control } = form;

  if (!options || options.length === 0) return null;

  const optionValues = options.map((option) =>
    (option?.values || [])
      .filter((item) => item && item.value !== "")
      .map((item, index) => ({
        value: item.value,
        tierIndex: index,
      }))
  );

  if (optionValues.some((values) => values.length === 0)) return null;

  const rowspans: number[] = [];
  for (let i = 0; i < optionValues.length; i++) {
    let span = 1;
    for (let j = i + 1; j < optionValues.length; j++) {
      span *= optionValues[j].length;
    }
    rowspans.push(span);
  }

  const combinations = generateCombinations(optionValues);
  if (combinations.length === 0) return null;

  const rows: JSX.Element[] = [];
  const processedCells = new Set();

  combinations.forEach((combo, rowIndex) => {
    const row: JSX.Element[] = [];
    const variationIndex = findVariation(combo.map((c) => c.tierIndex));

    combo.forEach((item, colIndex) => {
      const cellKey = `${rowIndex}-${colIndex}-${item.value}`;
      if (!processedCells.has(cellKey) && rowIndex % rowspans[colIndex] === 0) {
        processedCells.add(cellKey);
        const optionValueIndex = findOptionValueIndex(colIndex, item.value);

        row.push(
          <td
            key={`option-${colIndex}`}
            rowSpan={rowspans[colIndex]}
            className="border-r p-3 align-middle"
          >
            <div className="flex flex-col items-center">
              <span className="text-gray-700 mb-2">
                {item.value}
                {form.getValues(
                  `options.${colIndex}.values.${optionValueIndex}.image`
                )}
              </span>
              {colIndex === 0 ? (
                <div>
                  {/* Image */}
                  <FormField
                    control={control}
                    name={`options.${colIndex}.values.${optionValueIndex}.image`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
                            <ImageUploadForm field={field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : null}
            </div>
          </td>
        );
      }
    });

    // Variation Fields
    row.push(
      <td key="originalPrice" className="border-r p-3">
        {variationIndex !== -1 && (
          <FormField
            control={control}
            name={`variations.${variationIndex}.originalPrice`}
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    placeholder="ใส่ค่า"
                    className="border-gray-300"
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-6" />
              </FormItem>
            )}
          />
        )}
      </td>
    );

    row.push(
      <td key="stock" className="border-r p-3">
        {variationIndex !== -1 && (
          <FormField
            control={control}
            name={`variations.${variationIndex}.stock`}
            render={({ field }) => (
              <FormItem className="relative">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={0}
                    placeholder="ใส่ค่า"
                    className="border-gray-300"
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-6" />
              </FormItem>
            )}
          />
        )}
      </td>
    );

    row.push(
      <td key="sku" className="px-3 py-6">
        {variationIndex !== -1 && (
          <FormField
            control={control}
            name={`variations.${variationIndex}.sku`}
            render={({ field }) => (
              <FormItem>
                <FormControl className="relative">
                  <Input
                    {...field}
                    placeholder="ใส่ค่า"
                    className="border-gray-300"
                  />
                </FormControl>
                <FormMessage className="absolute -bottom-6" />
              </FormItem>
            )}
          />
        )}
      </td>
    );

    rows.push(
      <tr
        key={combo.map((i) => i.tierIndex).join("-")}
        className={rowIndex < combinations.length - 1 ? "border-b" : ""}
      >
        {row}
      </tr>
    );
  });

  return rows;
}
