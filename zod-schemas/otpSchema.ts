// schemas/otpSchema.ts
import { z } from "zod";

export const otpSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "กรุณากรอกเบอร์โทร",
    })
    .regex(/^0[0-9]{9}$/, "รูปแบบเบอร์โทรไม่ถูกต้อง"),
  otp: z.string().length(6, "รหัส OTP ต้องมี 6 หลัก"), // ตัวอย่าง OTP ต้องมีความยาว 6 หลัก
});

// สำหรับการ validate การขอ OTP
export const requestOtpSchema = otpSchema.pick({ phoneNumber: true });

// สำหรับการ validate การ verify OTP
export const verifyOtpSchema = otpSchema; // .pick({ otp: true });
