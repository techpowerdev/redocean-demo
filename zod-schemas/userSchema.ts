import { z } from "zod";

export const UserFormSchema = z.object({
  fullName: z
    .string()
    .optional()
    // กำหนดให้ฟิลด์ว่างได้("") แต่ไม่ให้กรอกช่องว่าง(" ")เปล่าๆส่งมา
    .refine((val) => val === "" || val?.trim() !== "", {
      message: "กรุณากรอกชื่อ-สกุล",
    }),

  phoneNumber: z
    .string({
      required_error: "กรุณาระบุเบอร์โทร", // ใช้ข้อความนี้เมื่อฟิลด์ว่าง
    })
    .min(9, "กรุณาระบุเบอร์โทร") // ตรวจสอบให้แน่ใจว่าฟิลด์ไม่ว่าง
    .regex(/^0[0-9]{9}$/, { message: "รูปแบบเบอร์โทรไม่ถูกต้อง" }), // ตรวจสอบรูปแบบเบอร์โทร
  email: z
    .string()
    .optional()
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "กรุณาระบุอีเมลที่ถูกต้อง",
    }),
});
