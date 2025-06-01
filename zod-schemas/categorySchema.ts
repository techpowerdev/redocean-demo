import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(2, {
    message: "กรุณาระบุชื่อหมวดหมู่สินค้า",
  }),
});
