// "use client";

// // import { getProductVariantStock } from "@/services/productServices";
// import { ProductVariantType } from "@/types/fetchTypes";
// import React, { useState } from "react";

// type Props = {
//   // productId: string;
//   selectedOptions: Record<string, string | undefined>;
//   productVariants: ProductVariantType[] | null | undefined;
//   handleOptionChange: (key: string, value: string) => void;
// };

// export default function ProductOptions({
//   // productId,
//   productVariants,
//   selectedOptions,
//   handleOptionChange,
// }: Props) {
//   // const stock = getProductVariantStock(productId, selectedOptions);
//   // หาสีและขนาดที่มีอยู่
//   // const availableColors = Array.from(
//   //   new Set(productVariants?.map((variant) => variant.color))
//   // );
//   // const allAvailableSizes = Array.from(
//   //   new Set(productVariants?.map((variant) => variant.size))
//   // );
//   // const availableSizes = Array.from(
//   //   new Set(
//   //     productVariants
//   //       ?.filter((variant) => variant.color === selectedOptions.color)
//   //       .map((variant) => variant.size)
//   //   )
//   // );
//   // return (
//   //   <div>
//   //     {/* stock:{stock} */}
//   //     <div className="mb-2">
//   //       <label className="block font-semibold mb-1">เลือกสี:</label>
//   //       <div className="flex gap-2">
//   //         {availableColors.map((color) => (
//   //           <button
//   //             key={color}
//   //             // onClick={() => setSelectedColor(color)}
//   //             onClick={() => handleOptionChange("color", color)}
//   //             className={`py-2 px-4 rounded ${
//   //               selectedOptions.color === color
//   //                 ? "bg-gray-700 text-white"
//   //                 : "bg-gray-200"
//   //             }`}
//   //           >
//   //             {color}
//   //           </button>
//   //         ))}
//   //       </div>
//   //     </div>
//   //     {/* Size Picker */}
//   //     {selectedOptions.color ? (
//   //       <div className="mb-2">
//   //         <label className="block font-semibold mb-1">เลือกขนาด:</label>
//   //         <div className="flex gap-2">
//   //           {availableSizes.map((size) => (
//   //             <button
//   //               key={size}
//   //               // onClick={() => setSelectedSize(size)}
//   //               onClick={() => handleOptionChange("size", size)}
//   //               className={`py-2 px-4 rounded ${
//   //                 selectedOptions.size === size
//   //                   ? "bg-gray-700 text-white"
//   //                   : "bg-gray-200"
//   //               }`}
//   //             >
//   //               {size}
//   //             </button>
//   //           ))}
//   //         </div>
//   //       </div>
//   //     ) : (
//   //       <div className="mb-2">
//   //         <label className="block font-semibold mb-1">เลือกขนาด:</label>
//   //         <div className="flex gap-2">
//   //           {allAvailableSizes.map((size) => (
//   //             <button
//   //               key={size}
//   //               onClick={() => handleOptionChange("size", size)}
//   //               className={`py-2 px-4 rounded ${
//   //                 selectedOptions.size === size
//   //                   ? "bg-gray-700 text-white"
//   //                   : "bg-gray-200"
//   //               }`}
//   //             >
//   //               {size}
//   //             </button>
//   //           ))}
//   //         </div>
//   //       </div>
//   //     )}
//   //   </div>
//   // );

//   // ดึงตัวเลือกทั้งหมดจาก variantOptions
//   const optionsMap: Record<string, Set<string>> = {};

//   productVariants?.forEach((variant) => {
//     variant.variantOptions?.forEach((option) => {
//       Object.entries(option).forEach(([key, value]) => {
//         if (!optionsMap[key]) optionsMap[key] = new Set();
//         optionsMap[key].add(value as string);
//       });
//     });
//   });

//   // แปลง Set เป็น Array สำหรับการแสดงผล
//   const options = Object.entries(optionsMap).map(([key, values]) => ({
//     key,
//     values: Array.from(values),
//   }));

//   return (
//     <div>
//       <h1>Select Options</h1>
//       {options.map((option) => (
//         <div key={option.key}>
//           <h2>{option.key}</h2>
//           <div>
//             {option.values.map((value) => (
//               <button
//                 key={value}
//                 // onClick={() => handleOptionSelect(option.key, value)}
//                 onClick={() => handleOptionChange(option.key, value)}
//                 style={{
//                   margin: "0.5rem",
//                   padding: "0.5rem 1rem",
//                   backgroundColor:
//                     selectedOptions[option.key] === value
//                       ? "lightblue"
//                       : "white",
//                   border: "1px solid black",
//                   cursor: "pointer",
//                 }}
//               >
//                 {value}
//               </button>
//             ))}
//           </div>
//         </div>
//       ))}
//       <div>
//         <h2>Selected Options:</h2>
//         <pre>{JSON.stringify(selectedOptions, null, 2)}</pre>
//       </div>
//     </div>
//   );
// }

// @@@@@@@@@@@@@@----------version 2

// "use client";

// import { ProductVariantType } from "@/types/fetchTypes";
// import React from "react";

// type Props = {
//   selectedOptions: Record<string, string | undefined>;
//   productVariants: ProductVariantType[] | null | undefined;
//   handleOptionChange: (key: string, value: string) => void;
// };

// export default function ProductOptions({
//   productVariants,
//   selectedOptions,
//   handleOptionChange,
// }: Props) {
//   // ดึงตัวเลือกทั้งหมดจาก variantOptions
//   const optionsMap: Record<string, Set<string>> = {};

//   productVariants?.forEach((variant) => {
//     variant.variantOptions?.forEach((option) => {
//       Object.entries(option).forEach(([key, value]) => {
//         if (!optionsMap[key]) optionsMap[key] = new Set();
//         optionsMap[key].add(value as string);
//       });
//     });
//   });

//   // แปลง Set เป็น Array สำหรับการแสดงผล
//   const options = Object.entries(optionsMap).map(([key, values]) => ({
//     key,
//     values: Array.from(values),
//   }));

//   return (
//     <div>
//       <h1 className="text-xl font-semibold">ตัวเลือกสินค้า</h1>
//       {options.map((option) => (
//         <div key={option.key}>
//           <h2>{option.key}</h2>
//           <div>
//             {option.values.map((value) => (
//               <button
//                 key={value}
//                 onClick={() => handleOptionChange(option.key, value)}
//                 style={{
//                   margin: "0.5rem",
//                   padding: "0.5rem 1rem",
//                   backgroundColor:
//                     selectedOptions[option.key] === value
//                       ? "lightblue"
//                       : "white",
//                   border: "1px solid black",
//                   cursor: "pointer",
//                 }}
//               >
//                 {value}
//               </button>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// // @@@@@@@@@@@@--------- version 3
// "use client";

// import { ProductVariantType } from "@/types/fetchTypes";
// import React from "react";

// type Props = {
//   selectedOptions: Record<string, string | undefined>;
//   productVariants: ProductVariantType[] | null | undefined;
//   handleOptionChange: (key: string, value: string) => void;
// };

// export default function ProductOptions({
//   productVariants,
//   selectedOptions,
//   handleOptionChange,
// }: Props) {
//   // ดึงตัวเลือกทั้งหมดจาก variantOptions
//   const optionsMap: Record<string, Set<string>> = {};

//   productVariants?.forEach((variant) => {
//     Object.entries(variant.variantOptions).forEach(([key, value]) => {
//       if (!optionsMap[key]) optionsMap[key] = new Set();
//       optionsMap[key].add(value as string);
//     });
//   });

//   // แปลง Set เป็น Array สำหรับการแสดงผล
//   const options = Object.entries(optionsMap).map(([key, values]) => ({
//     key,
//     values: Array.from(values),
//   }));

//   // ตรวจสอบว่ามีตัวเลือกที่ยังไม่ได้เลือกหรือไม่
//   const missingOptions = options
//     .filter((option) => !selectedOptions[option.key])
//     .map((option) => option.key);

//   const isAllOptionsSelected = missingOptions.length === 0;

//   return (
//     <div>
//       <h1 className="text-xl font-semibold">ตัวเลือกสินค้า</h1>
//       {options.map((option) => (
//         <div key={option.key}>
//           <h2>{option.key}</h2>
//           <div>
//             {option.values.map((value) => (
//               <button
//                 key={value}
//                 onClick={() => handleOptionChange(option.key, value)}
//                 style={{
//                   margin: "0.5rem",
//                   padding: "0.5rem 1rem",
//                   backgroundColor:
//                     selectedOptions[option.key] === value
//                       ? "lightblue"
//                       : "white",
//                   border: "1px solid black",
//                   cursor: "pointer",
//                 }}
//               >
//                 {value}
//               </button>
//             ))}
//           </div>
//         </div>
//       ))}

//       {/* แสดงข้อความเตือนหากยังมีตัวเลือกที่ไม่ได้เลือก */}
//       {!isAllOptionsSelected && (
//         <div style={{ color: "red", marginTop: "1rem" }}>
//           โปรดเลือกตัวเลือกต่อไปนี้: {missingOptions.join(", ")}
//         </div>
//       )}
//     </div>
//   );
// }

// @@@@@@@@@@------version 4
// "use client";

// import { ProductVariantType } from "@/types/fetchTypes";
// import React from "react";

// type Props = {
//   selectedOptions: Record<string, string | undefined>;
//   productVariants: ProductVariantType[] | null | undefined;
//   handleOptionChange: (key: string, value: string) => void;
// };

// export default function ProductOptions({
//   productVariants,
//   selectedOptions,
//   handleOptionChange,
// }: Props) {
//   // ดึงตัวเลือกทั้งหมดจาก variantOptions
//   const optionsMap: Record<string, Set<string>> = {};

//   productVariants?.forEach((variant) => {
//     Object.entries(variant.variantOptions).forEach(([key, value]) => {
//       if (!optionsMap[key]) optionsMap[key] = new Set();
//       optionsMap[key].add(value as string);
//     });
//   });

//   // แปลง Set เป็น Array สำหรับการแสดงผล
//   const options = Object.entries(optionsMap).map(([key, values]) => ({
//     key,
//     values: Array.from(values),
//   }));

//   // กรองตัวเลือกที่ยังใช้งานได้ตามตัวเลือกที่เลือกแล้ว
//   const getFilteredOptions = (key: string): Set<string> => {
//     const activeVariants = productVariants?.filter((variant) =>
//       Object.entries(selectedOptions).every(
//         ([selectedKey, selectedValue]) =>
//           !selectedValue ||
//           variant.variantOptions[selectedKey] === selectedValue
//       )
//     );

//     const validValues = new Set<string>();
//     activeVariants?.forEach((variant) => {
//       if (variant.variantOptions[key]) {
//         validValues.add(variant.variantOptions[key] as string);
//       }
//     });

//     return validValues;
//   };

//   return (
//     <div>
//       <h1 className="text-xl font-semibold">ตัวเลือกสินค้า</h1>
//       {options.map((option) => {
//         const filteredValues = getFilteredOptions(option.key);

//         return (
//           <div key={option.key}>
//             <h2>{option.key}</h2>
//             <div>
//               {option.values.map((value) => (
//                 <button
//                   key={value}
//                   onClick={() => handleOptionChange(option.key, value)}
//                   disabled={!filteredValues.has(value)} // ปิดการใช้งานหากไม่เกี่ยวข้อง
//                   style={{
//                     margin: "0.5rem",
//                     padding: "0.5rem 1rem",
//                     backgroundColor:
//                       selectedOptions[option.key] === value
//                         ? "lightblue"
//                         : filteredValues.has(value)
//                         ? "white"
//                         : "lightgray",
//                     border: "1px solid black",
//                     cursor: filteredValues.has(value)
//                       ? "pointer"
//                       : "not-allowed",
//                   }}
//                 >
//                   {value}
//                 </button>
//               ))}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// @@@@@@@@----version5 เยี่ยมแล้ว
// "use client";

// import { cn } from "@/lib/utils";
// import { ProductVariantType } from "@/types/fetchTypes";
// import { CircleCheckBig } from "lucide-react";
// import React from "react";

// type Props = {
//   selectedOptions: Record<string, string | undefined>;
//   productVariants: ProductVariantType[] | null | undefined;
//   handleOptionChange: (key: string, value: string) => void;
// };

// export default function ProductOptions({
//   productVariants,
//   selectedOptions,
//   handleOptionChange,
// }: Props) {
//   // ดึงตัวเลือกทั้งหมดจาก variantOptions
//   const optionsMap: Record<string, Set<string>> = {};

//   productVariants?.forEach((variant) => {
//     Object.entries(variant.variantOptions).forEach(([key, value]) => {
//       if (!optionsMap[key]) optionsMap[key] = new Set();
//       optionsMap[key].add(value as string);
//     });
//   });

//   // แปลง Set เป็น Array สำหรับการแสดงผล
//   const options = Object.entries(optionsMap).map(([key, values]) => ({
//     key,
//     values: Array.from(values),
//   }));

//   // ฟังก์ชันกรองตัวเลือกที่สามารถเลือกได้
//   const getFilteredOptions = (key: string): Set<string> => {
//     // สร้าง selectedOptions ที่ไม่รวม key ปัจจุบัน
//     const otherSelectedOptions = Object.entries(selectedOptions).reduce(
//       (acc, [selectedKey, selectedValue]) => {
//         if (selectedKey !== key && selectedValue) {
//           acc[selectedKey] = selectedValue;
//         }
//         return acc;
//       },
//       {} as Record<string, string>
//     );

//     // กรอง variant ที่ตรงกับตัวเลือกอื่น
//     const activeVariants = productVariants?.filter((variant) =>
//       Object.entries(otherSelectedOptions).every(
//         ([selectedKey, selectedValue]) =>
//           variant.variantOptions[selectedKey] === selectedValue
//       )
//     );

//     // ดึงค่าที่เป็นไปได้สำหรับ key ปัจจุบัน
//     const validValues = new Set<string>();
//     activeVariants?.forEach((variant) => {
//       if (variant.variantOptions[key]) {
//         validValues.add(variant.variantOptions[key] as string);
//       }
//     });

//     return validValues;
//   };

//   return (
//     <div>
//       <h1 className="text-xl font-semibold">ตัวเลือกสินค้า</h1>
//       {options.map((option) => {
//         const filteredValues = getFilteredOptions(option.key);

//         return (
//           <div key={option.key}>
//             <h2>{option.key}</h2>
//             <div>
//               {option.values.map((value) => (
//                 <button
//                   key={value}
//                   onClick={() => handleOptionChange(option.key, value)}
//                   className={cn(
//                     "m-2 relative",
//                     "px-4 py-2 border rounded-md",
//                     selectedOptions[option.key] === value
//                       ? "bg-gray-600 text-white"
//                       : filteredValues.has(value)
//                       ? "bg-white"
//                       : "bg-gray-200",
//                     filteredValues.has(value)
//                       ? "cursor-pointer"
//                       : "cursor-not-allowed"
//                   )}
//                   disabled={!filteredValues.has(value)} // ปิดการใช้งานหากไม่เกี่ยวข้อง
//                 >
//                   {value}
//                   <span
//                     className={cn(
//                       "absolute top-1 right-1",
//                       selectedOptions[option.key] === value ? "block" : "hidden"
//                     )}
//                   >
//                     <CircleCheckBig size={14} className="text-green-500" />
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// version 6 ปรับ bug ในการเลือกตัวเลือก
// "use client";

// import { cn } from "@/lib/utils";
// import { ProductVariantType } from "@/types/fetchTypes";
// import { CircleCheckBig } from "lucide-react";
// import React from "react";

// type Props = {
//   selectedOptions: Record<string, string | undefined>;
//   productVariants: ProductVariantType[] | null | undefined;
//   handleOptionChange: (key: string, value: string) => void;
// };

// export default function ProductOptions({
//   productVariants,
//   selectedOptions,
//   handleOptionChange,
// }: Props) {
//   // ดึงตัวเลือกทั้งหมดจาก variantOptions
//   const optionsMap: Record<string, Set<string>> = {};

//   productVariants?.forEach((variant) => {
//     Object.entries(variant.variantOptions).forEach(([key, value]) => {
//       if (!optionsMap[key]) optionsMap[key] = new Set();
//       optionsMap[key].add(value as string);
//     });
//   });

//   // แปลง Set เป็น Array สำหรับการแสดงผล
//   const options = Object.entries(optionsMap).map(([key, values]) => ({
//     key,
//     values: Array.from(values),
//   }));

//   // ฟังก์ชันกรองตัวเลือกที่สามารถเลือกได้
//   // const getFilteredOptions = (key: string): Set<string> => {
//   //   const otherSelectedOptions = Object.entries(selectedOptions).reduce(
//   //     (acc, [selectedKey, selectedValue]) => {
//   //       if (selectedKey !== key && selectedValue) {
//   //         acc[selectedKey] = selectedValue;
//   //       }
//   //       return acc;
//   //     },
//   //     {} as Record<string, string>
//   //   );

//   //   // กรอง variant ที่ตรงกับตัวเลือกอื่น
//   //   const activeVariants = productVariants?.filter((variant) =>
//   //     Object.entries(otherSelectedOptions).every(
//   //       ([selectedKey, selectedValue]) =>
//   //         variant.variantOptions[selectedKey] === selectedValue
//   //     )
//   //   );

//   //   // ดึงค่าที่เป็นไปได้สำหรับ key ปัจจุบัน
//   //   const validValues = new Set<string>();
//   //   activeVariants?.forEach((variant) => {
//   //     if (variant.variantOptions[key]) {
//   //       validValues.add(variant.variantOptions[key] as string);
//   //     }
//   //   });

//   //   return validValues;
//   // };

//   return (
//     <div>
//       <h1 className="text-xl font-semibold">ตัวเลือกสินค้า</h1>
//       {options.map((option) => {
//         // const filteredValues = getFilteredOptions(option.key);

//         return (
//           <div key={option.key}>
//             <h2>{option.key}</h2>
//             <div>
//               {option.values.map((value) => {
//                 const isSelected = selectedOptions[option.key] === value;
//                 // const isValid = filteredValues.has(value);

//                 // ฟังก์ชันแสดงปุ่มที่สามารถเลือกได้
//                 return (
//                   <button
//                     key={value}
//                     onClick={() => handleOptionChange(option.key, value)}
//                     className={cn(
//                       "m-2 relative",
//                       "px-4 py-2 border rounded-md",
//                       isSelected ? "bg-gray-600 text-white" : "bg-white"
//                       /* isValid ? "cursor-pointer" : "cursor-not-allowed",
//                       / !isValid ? "bg-gray-200" : ""*/
//                     )}
//                     // disabled={!isValid} // ปิดการใช้งานหากไม่เกี่ยวข้อง
//                   >
//                     {value}
//                     {isSelected && (
//                       <span className="absolute top-1 right-1">
//                         <CircleCheckBig size={14} className="text-green-500" />
//                       </span>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

// toggle การเลือกได้
"use client";

import { cn } from "@/lib/utils";
import { ProductVariantType } from "@/types/productTypes";
// import { ProductVariantType } from "@/types/fetchTypes";
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
