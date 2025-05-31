// import { z } from "zod";

// // Define the schema for validation using zod
// export const optionValueSchema = z.object({
//   id: z.string(),
//   value: z
//     .string()
//     .min(1, "กรุณาระบุค่าตัวเลือก")
//     .max(20, "ข้อความต้องไม่เกิน 20 ตัวอักษร"),
//   image: z.string({ invalid_type_error: "กรุณาเลือกรูป" }).optional(),
// });

// export const optionSchema = z.object({
//   name: z
//     .string()
//     .min(1, "กรุณากรอกชื่อตัวเลือก")
//     .max(14, "ชื่อตัวเลือกต้องไม่เกิน 14 ตัวอักษร"),
//   values: z.array(optionValueSchema),
// });

// export const productVariationSchema = z.object({
//   id: z.string().optional(),
//   tierIndex: z.array(z.number()),
//   name: z.string(),
//   originalPrice: z.coerce
//     .number({
//       required_error: "กรุณาระบุราคาสินค้า",
//       invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
//     })
//     .min(1, { message: "ราคาต้องไม่น้อยกว่า 1" }),

//   stock: z.coerce
//     .number({
//       required_error: "กรุณาระบุจำนวนสต๊อคสินค้า",
//       invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
//     })
//     .int({ message: "ระบุเป็นตัวเลขจำนวนเต็มเท่านั้น" })
//     .min(0, { message: "จำนวนต้องไม่น้อยกว่า 0" }),

//   sku: z.string().optional(),
// });

// export const ProductWithVariantionSchema = z
//   .object({
//     sku: z
//       .string({ required_error: "กรุณาระบุรหัสสินค้า" })
//       .trim()
//       .min(1, "กรุณาระบุรหัสสินค้า"),
//     name: z
//       .string({ required_error: "กรุณาระบุชื่อสินค้า" })
//       .trim()
//       .min(1, "กรุณาระบุชื่อสินค้า"),
//     images: z.array(z.string()).min(1, "อัปโหลดอย่างน้อย 1 รูป"),
//     categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่สินค้า"),
//     description: z
//       .string({ required_error: "กรุณาระบุคำอธิบาย" })
//       .trim()
//       .min(5, "กรุณาระบุคำอธิบายอย่างน้อย 5 ตัวอักษร"),
//     originalPrice: z.coerce.number().optional(),
//     stock: z.coerce.number().optional(),
//     hasVariants: z.boolean(),
//     options: z.array(optionSchema).min(0).max(3),
//     variations: z.array(productVariationSchema),
//   })
//   .superRefine((data, ctx) => {
//     // custom validation
//     // หากเป็นสินค้าไม่มีตัวเลือก ให้บังคับกรอก originalPrice และ stock ของสินค้า
//     if (data.hasVariants === false) {
//       if (data.originalPrice === undefined || isNaN(data.originalPrice)) {
//         ctx.addIssue({
//           path: ["originalPrice"],
//           code: z.ZodIssueCode.custom,
//           message: "กรุณาระบุราคาสินค้า",
//         });
//       } else {
//         if (data.originalPrice === 0) {
//           ctx.addIssue({
//             path: ["originalPrice"],
//             code: z.ZodIssueCode.custom,
//             message: "ราคาต้องไม่น้อยกว่า 1",
//           });
//         }
//       }

//       if (data.stock === undefined || isNaN(data.stock)) {
//         ctx.addIssue({
//           path: ["stock"],
//           code: z.ZodIssueCode.custom,
//           message: "กรุณาระบุจำนวนสินค้า",
//         });
//       }
//     }

//     if (data.images[0] === "") {
//       ctx.addIssue({
//         path: ["images", 0],
//         code: z.ZodIssueCode.custom,
//         message: "กรุณาเลือกรูปภาพ",
//       });
//     }

//     // หากมีการกำหนดรูปให้ตัวเลือก ต้องกำหนดให้ทุกตัวเลือก
//     const firstOption = data.options[0];
//     if (firstOption && firstOption.values.length > 0) {
//       const anyHasImage = firstOption.values.some(
//         (val) => val.image && val.image.trim() !== ""
//       );

//       if (anyHasImage) {
//         firstOption.values.forEach((val, index) => {
//           if (!val.image || val.image.trim() === "") {
//             ctx.addIssue({
//               path: ["options", 0, "values", index, "image"],
//               code: z.ZodIssueCode.custom,
//               message: "กรุณาเลือกรูปภาพ",
//             });
//           }
//         });
//       }
//     }
//   });

import { z } from "zod";

// Define the schema for validation using zod

export const imageSchema = z.object({
  image: z.string(),
});

export const optionValueSchema = z.object({
  optionId: z.string(),
  value: z
    .string()
    .min(1, "กรุณาระบุค่าตัวเลือก")
    .max(20, "ข้อความต้องไม่เกิน 20 ตัวอักษร"),
  image: z.string({ invalid_type_error: "กรุณาเลือกรูป" }).optional(),
});

export const optionSchema = z.object({
  name: z
    .string()
    .min(1, "กรุณากรอกชื่อตัวเลือก")
    .max(14, "ชื่อตัวเลือกต้องไม่เกิน 14 ตัวอักษร"),
  values: z.array(optionValueSchema),
});

export const productVariationSchema = z.object({
  id: z.string().optional(),
  key: z.string().optional(), // join optionId
  tierIndex: z.array(z.number()),
  name: z.string(),
  image: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val)), // convert empty string to undefined,
  originalPrice: z.coerce
    .number({
      required_error: "กรุณาระบุราคาสินค้า",
      invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
    })
    .min(1, { message: "ราคาต้องไม่น้อยกว่า 1" }),

  stock: z.coerce
    .number({
      required_error: "กรุณาระบุจำนวนสต๊อคสินค้า",
      invalid_type_error: "ระบุเป็นตัวเลขเท่านั้น",
    })
    .int({ message: "ระบุเป็นตัวเลขจำนวนเต็มเท่านั้น" })
    .min(0, { message: "จำนวนต้องไม่น้อยกว่า 0" }),

  sku: z
    .string()
    .optional()
    .transform((val) => (val?.trim() === "" ? undefined : val)), // convert empty string to undefined,
});

export const ProductWithVariantionSchema = z
  .object({
    sku: z
      .string()
      .optional()
      .transform((val) => (val?.trim() === "" ? undefined : val)), // convert empty string to undefined,
    name: z
      .string({ required_error: "กรุณาระบุชื่อสินค้า" })
      .trim()
      .min(1, "กรุณาระบุชื่อสินค้า"),
    images: z.array(z.string()).min(1, "อัปโหลดอย่างน้อย 1 รูป"),
    categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่สินค้า"),
    description: z
      .string({ required_error: "กรุณาระบุคำอธิบาย" })
      .trim()
      .min(5, "กรุณาระบุคำอธิบายอย่างน้อย 5 ตัวอักษร"),
    originalPrice: z.coerce.number().optional(),
    stock: z.coerce.number().optional(),
    hasVariants: z.boolean(),
    options: z.array(optionSchema).min(0).max(3),
    variations: z.array(productVariationSchema),
  })
  .superRefine((data, ctx) => {
    // custom validation
    // หากเป็นสินค้าไม่มีตัวเลือก ให้บังคับกรอก originalPrice และ stock ของสินค้า
    if (data.hasVariants === false) {
      if (data.originalPrice === undefined || isNaN(data.originalPrice)) {
        ctx.addIssue({
          path: ["originalPrice"],
          code: z.ZodIssueCode.custom,
          message: "กรุณาระบุราคาสินค้า",
        });
      } else {
        if (data.originalPrice === 0) {
          ctx.addIssue({
            path: ["originalPrice"],
            code: z.ZodIssueCode.custom,
            message: "ราคาต้องไม่น้อยกว่า 1",
          });
        }
      }

      if (data.stock === undefined || isNaN(data.stock)) {
        ctx.addIssue({
          path: ["stock"],
          code: z.ZodIssueCode.custom,
          message: "กรุณาระบุจำนวนสินค้า",
        });
      }
    }

    if (data.images[0] === "") {
      ctx.addIssue({
        path: ["images", 0],
        code: z.ZodIssueCode.custom,
        message: "กรุณาเลือกรูปภาพ",
      });
    }

    // หากมีการกำหนดรูปให้ตัวเลือก ต้องกำหนดให้ทุกตัวเลือก
    const firstOption = data.options[0];
    if (firstOption && firstOption.values.length > 0) {
      const anyHasImage = firstOption.values.some(
        (val) => val.image && val.image.trim() !== ""
      );

      if (anyHasImage) {
        firstOption.values.forEach((val, index) => {
          if (!val.image || val.image.trim() === "") {
            ctx.addIssue({
              path: ["options", 0, "values", index, "image"],
              code: z.ZodIssueCode.custom,
              message: "กรุณาเลือกรูปภาพ",
            });
          }
        });
      }
    }

    // // ตรวจสอบชื่อตัวเลือกไม่ให้ซ้ำกัน
    // const optionNames = data.options.map((opt) => opt.name.trim());
    // const duplicateNames = optionNames.filter(
    //   (name, index) => optionNames.indexOf(name) !== index
    // );
    // if (duplicateNames.length > 0) {
    //   ctx.addIssue({
    //     path: ["options"],
    //     code: z.ZodIssueCode.custom,
    //     message: "ชื่อตัวเลือกต้องไม่ซ้ำกัน",
    //   });
    // }

    // // ตรวจสอบค่าภายในตัวเลือกไม่ให้ซ้ำกัน
    // data.options.forEach((option, optionIndex) => {
    //   const valueNames = option.values.map((val) => val.value.trim());
    //   const duplicateValues = valueNames.filter(
    //     (val, idx) => valueNames.indexOf(val) !== idx
    //   );

    //   if (duplicateValues.length > 0) {
    //     ctx.addIssue({
    //       path: ["options", optionIndex, "values"],
    //       code: z.ZodIssueCode.custom,
    //       message: "ค่าตัวเลือกต้องไม่ซ้ำกัน",
    //     });
    //   }
    // });

    // ตรวจสอบชื่อตัวเลือกไม่ให้ซ้ำกัน
    const optionNames = data.options.map((opt) => opt.name.trim());
    const seenNames = new Map<string, number[]>();

    optionNames.forEach((name, idx) => {
      if (!seenNames.has(name)) {
        seenNames.set(name, [idx]);
      } else {
        seenNames.get(name)?.push(idx);
      }
    });

    seenNames.forEach((indexes, name) => {
      if (indexes.length > 1) {
        // เว้นตัวแรกไว้
        indexes.slice(1).forEach((i) => {
          ctx.addIssue({
            path: ["options", i, "name"],
            code: z.ZodIssueCode.custom,
            message: `ชื่อตัวเลือก "${name}" ซ้ำ`,
          });
        });
      }
    });

    // ตรวจสอบค่าภายในตัวเลือกไม่ให้ซ้ำกัน
    data.options.forEach((option, optionIndex) => {
      const valueNames = option.values.map((val) => val.value.trim());
      const seen = new Map<string, number[]>(); // เก็บตำแหน่งของค่าที่เจอ

      valueNames.forEach((name, idx) => {
        if (!seen.has(name)) {
          seen.set(name, [idx]);
        } else {
          seen.get(name)?.push(idx);
        }
      });

      // แจ้ง error เฉพาะตัวที่ซ้ำ (ยกเว้นตัวแรก)
      seen.forEach((indexes, name) => {
        if (indexes.length > 1) {
          // เริ่มที่ index 1 (เว้นตัวแรกไว้)
          indexes.slice(1).forEach((dupIndex) => {
            ctx.addIssue({
              path: ["options", optionIndex, "values", dupIndex, "value"],
              code: z.ZodIssueCode.custom,
              message: `ค่าตัวเลือก "${name}" ซ้ำกับค่าอื่น`,
            });
          });
        }
      });
    });
  });
