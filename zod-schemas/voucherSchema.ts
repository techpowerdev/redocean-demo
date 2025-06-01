import { z } from "zod";

export const VoucherFormSchema = z
  .object({
    storeName: z.string().trim().min(1, "กรุณาระบุชื่อร้าน/แบรนด์"),
    description: z.string().trim().min(1, "กรุณาระบุคำอธิบาย"),
    // image: z.string().trim().min(1, "กรุณาเพิ่ม Logo แบรนด์").optional(),
    amount: z.coerce
      .number({ required_error: "กรุณาระบุจำนวนเงิน" })
      .min(1, "มูลค่าบัตรต้องมากกว่า 0"),
    expiresAt: z.string().optional(),
    // expiresAt: z.string().nullable().optional(),

    limitPurchasePerUser: z.boolean({
      required_error: "กรุณาระบุว่าต้องการจำกัดจำนวนการซื้อหรือไม่",
    }),
    maxPurchasePerUser: z.coerce
      .number()
      .int("ต้องเป็นเลขจำนวนเต็ม")
      .optional(),
    vouchers: z
      .array(
        z.object({
          id: z.string(),
          code: z
            .string()
            .min(1, "กรุณาระบุรหัสบัตร")
            .max(20, "รหัสต้องไม่เกิน 20 ตัว"),
        })
      )
      .min(1, "ต้องมีรหัสบัตรอย่างน้อย 1 รายการ"),
  })
  .superRefine((data, ctx) => {
    if (data.vouchers) {
      const seen = new Map<string, number[]>();
      data.vouchers.forEach((item, idx) => {
        const code = item.code.trim();
        if (!seen.has(code)) {
          seen.set(code, [idx]);
        } else {
          seen.get(code)?.push(idx);
        }
      });
      seen.forEach((indexes, code) => {
        if (indexes.length > 1) {
          indexes.slice(1).forEach((dupIndex) => {
            ctx.addIssue({
              path: ["vouchers", dupIndex, "code"],
              code: z.ZodIssueCode.custom,
              message: `รหัสบัตร "${code}" ซ้ำกัน`,
            });
          });
        }
      });
    }

    // ถ้าเปิดการจำกัด ต้องมี maxPurchasePerUser
    if (data.limitPurchasePerUser) {
      if (!data.maxPurchasePerUser) {
        ctx.addIssue({
          path: ["maxPurchasePerUser"],
          code: z.ZodIssueCode.custom,
          message: "กรุณาระบุจำนวนสูงสุดที่สามารถซื้อได้ต่อคน",
        });
      }
    }
  });
