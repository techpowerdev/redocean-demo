// schemas/otpSchema.ts
import { z } from "zod";

export const otpSchema = z.object({
  // phoneNumber: z
  //   .string({
  //     required_error: "กรุณากรอกเบอร์โทร",
  //   })
  //   .regex(/^0[0-9]{9}$/, "รูปแบบเบอร์โทรไม่ถูกต้อง"),
  phoneNumber: z
    .string({
      required_error: "กรุณาระบุเบอร์โทร", // ใช้ข้อความนี้เมื่อฟิลด์ว่าง
    })
    .nonempty({ message: "กรุณาระบุเบอร์โทร" }) // ตรวจสอบให้แน่ใจว่าฟิลด์ไม่ว่าง
    .regex(/^0[0-9]{9}$/, { message: "รูปแบบเบอร์โทรไม่ถูกต้อง" }), // ตรวจสอบรูปแบบเบอร์โทร
  otp: z.string().length(6, "รหัส OTP ต้องเป็นเลข 6 หลักเท่านั้น"), // ตัวอย่าง OTP ต้องมีความยาว 6 หลัก
});

// สำหรับการ validate การขอ OTP
export const requestOtpSchema = otpSchema.pick({ phoneNumber: true });

// สำหรับการ validate การ verify OTP
export const verifyOtpSchema = otpSchema; // .pick({ otp: true });
