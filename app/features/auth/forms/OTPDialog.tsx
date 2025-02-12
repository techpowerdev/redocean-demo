"use client";

import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/state-stores/useAuthStore";
import toast from "react-hot-toast";
import axios from "axios";
import { z } from "zod";
import { convertPhoneNumber } from "@/utils/convertPhoneNumber";
import { useRouter } from "next/navigation";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import { verifyUser } from "@/services/authServices";

const otpSchema = z.object({
  phoneNumber: z
    .string({
      required_error: "กรุณาระบุเบอร์โทร", // ใช้ข้อความนี้เมื่อฟิลด์ว่าง
    })
    .nonempty({ message: "กรุณาระบุเบอร์โทร" }) // ตรวจสอบให้แน่ใจว่าฟิลด์ไม่ว่าง
    .regex(/^0[0-9]{9}$/, { message: "รูปแบบเบอร์โทรไม่ถูกต้อง" }), // ตรวจสอบรูปแบบเบอร์โทร
  otp: z.string().length(6, "รหัส OTP ต้องเป็นเลข 6 หลักเท่านั้น"), // ตัวอย่าง OTP ต้องมีความยาว 6 หลัก
});

// สำหรับการ validate การขอ OTP
const requestOtpSchema = otpSchema.pick({ phoneNumber: true });

// สำหรับการ validate การ verify OTP
const verifyOtpSchema = otpSchema; // .pick({ otp: true });

const OTPDialog = () => {
  const router = useRouter();

  // global state
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const isVerified = useAuthStore((state) => state.isVerified);
  const setIsVerified = useAuthStore((state) => state.setIsVerified);

  // local state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const requestOtp = async () => {
    try {
      const validatedData = requestOtpSchema.parse({ phoneNumber });
      const phone = convertPhoneNumber(validatedData.phoneNumber);
      const body = {
        secretKey: `${process.env.NEXT_PUBLIC_DEESMSX_SECRETKEY}`,
        apiKey: `${process.env.NEXT_PUBLIC_DEESMSX_APIKEY}`,
        to: phone,
        sender: "KHUMKHA",
        lang: "th",
        isShowRef: "1",
      };
      setIsLoadingRequest(true);

      const response = await axios.post(
        "https://apicall.deesmsx.com/v1/otp/request",
        body
      );
      setVerifyToken(response.data.result.token);

      toast.success("ส่ง OTP ไปที่เบอร์มือถือของท่านแล้ว!");

      // เริ่ม Countdown 5 นาที
      setCountdown(300); // 300 วินาที
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message);
      } else {
        toast.error("ขอ OTP ไม่สำเร็จ");
      }
    } finally {
      setIsLoadingRequest(false);
    }
  };

  const verifyOtp = async () => {
    try {
      const validatedData = verifyOtpSchema.parse({ phoneNumber, otp });
      const verifyOTP = validatedData.otp;
      const body = {
        secretKey: `${process.env.NEXT_PUBLIC_DEESMSX_SECRETKEY}`,
        apiKey: `${process.env.NEXT_PUBLIC_DEESMSX_APIKEY}`,
        token: verifyToken,
        pin: verifyOTP,
      };
      setIsLoadingVerify(true);
      const response = await axios.post(
        "https://apicall.deesmsx.com/v1/otp/verify",
        body
      );

      if (response.data.code == 0 && response.data.msg == "Verify Success") {
        try {
          const response = await verifyUser({
            phoneNumber,
            phoneVerified: true,
          });
          setIsVerified(true);
          setCurrentUser(response.data);
          router.push("/");
          toast.success("ยืนยันตัวตนสำเร็จ!");
        } catch (error) {
          console.log(error);
        }
      } else {
        toast.error("รหัส OTP ไม่ถูกต้องหรือหมดอายุ");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message);
      } else {
        toast.error("ยืนยันตัวตนไม่สำเร็จ");
      }
    } finally {
      setIsLoadingVerify(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  if (isVerified) return null;

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="max-w-[375px]">
        <AlertDialogHeader>
          <AlertDialogTitle>กรุณายืนยันตัวตนของท่าน</AlertDialogTitle>
          <AlertDialogDescription className="hidden">
            Please enter your phone number and verify with the OTP.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          type="tel"
          placeholder="กรอกเบอร์มือถือ"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mb-4"
        />
        <Button
          onClick={requestOtp}
          disabled={isLoadingRequest || countdown > 0}
          className="flex justify-center items-center gap-2"
        >
          {isLoadingRequest ? (
            <>กำลังส่ง...</>
          ) : countdown > 0 ? (
            <span>
              รหัสกำลังจะหมดอายุในอีก {Math.floor(countdown / 60)}:
              {`0${countdown % 60}`.slice(-2)} นาที
            </span>
          ) : (
            <span>ขอรหัส OTP</span>
          )}
        </Button>

        <Input
          type="text"
          placeholder="กรอกรหัส OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mb-4"
        />
        <Button onClick={verifyOtp} disabled={isLoadingVerify}>
          {isLoadingVerify ? <>กำลังส่ง...</> : <span>ยืนยัน OTP</span>}
        </Button>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => router.push("/")}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPDialog;
