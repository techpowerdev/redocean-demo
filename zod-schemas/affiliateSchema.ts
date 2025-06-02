import { z } from "zod";

// Step 1 Schema
export const Step1AffiliateSchema = z.object({
  firstName: z.string().min(1, "กรุณาระบุชื่อ"),
  lastName: z.string().min(1, "กรุณาระบุนามสกุล"),
  email: z
    .string()
    .min(1, "กรุณาระบุอีเมล")
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "กรุณาระบุอีเมลที่ถูกต้อง",
    }),
  phoneNumber: z
    .string()
    .min(9, "กรุณาระบุเบอร์โทร") // ตรวจสอบให้แน่ใจว่าฟิลด์ไม่ว่าง
    .regex(/^0[0-9]{9}$/, { message: "เบอร์โทรไม่ถูกต้อง" }), // ตรวจสอบรูปแบบเบอร์โทร
  idCard: z.string().regex(/^\d{13}$/, {
    message: "กรุณาระบุเลขบัตรประชาชนให้ถูกต้อง (13 หลัก)",
  }),
  idCardImage: z.string().min(1, "กรุณาอัพโหลดรูปบัตรประจำตัวประชาชน"),
});

// Step 2 Schema
export const Step2AffiliateSchema = z.object({
  bankName: z.string().min(1, "กรุณาระบุชื่อธนาคาร"),
  channelCode: z.string().min(1, "กรุณาระบุ channel code"),
  accountHolderName: z
    .string()
    .min(1, "กรุณาระบุชื่อผู้ถือครอง ให้ตรงตามหน้าสมุดบัญชีธนาคาร"),
  accountNumber: z.string().min(1, "กรุณาระบุเลขบัญชี"),
  bookBankImage: z.string().min(1, "กรุณาอัพโหลดรูปหน้าสมุดบัญชีธนาคาร"),
});

// Final Schema (combine)
export const AffiliateSchema = Step1AffiliateSchema.merge(Step2AffiliateSchema);
