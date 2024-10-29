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
import { requestOtpSchema, verifyOtpSchema } from "@/zod-schemas/otpSchema"; // import schema
import { z } from "zod";
import { convertPhoneNumber } from "@/utils/convertPhoneNumber";
import { useRouter } from "next/navigation";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";

// interface OTPDialogProps {
//   onClose: () => void; // เพิ่ม prop นี้
// }

// const OTPDialog: React.FC<OTPDialogProps> = ({ onClose }) => {
const OTPDialog = () => {
  const router = useRouter();

  // global state
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const token = useCurrentUserStore((state) => state.token);
  const isTokenValid = useAuthStore((state) => state.isTokenValid);
  const isVerified = useAuthStore((state) => state.isVerified);
  const setIsVerified = useAuthStore((state) => state.setIsVerified);

  // local state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState(false);
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
      console.log("requestOTP:", response);
      setVerifyToken(response.data.result.token);

      toast.success("ส่ง OTP ไปที่เบอร์มือถือของท่านแล้ว!");
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
      console.log("verifyOTP:", response);

      if (response.data.code == 0 && response.data.msg == "Verify Success") {
        try {
          const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/verify-user`,
            {
              phoneNumber,
              phoneVerified: true,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // Attach the token here
              },
            }
          );
          setIsVerified(true);
          setCurrentUser(response.data.user);
          // onClose();
          toast.success("ยืนยันตัวตนสำเร็จ!");
          // router.push("/");
          window.location.href = `/`;
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
    // Check token validity on component mount
    if (token) {
      if (!isTokenValid(token)) {
        console.warn("Token expired or not available. Redirecting to login...");
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, []);
  console.log("isTokenValid", token && isTokenValid(token));

  if (isVerified) return null; // ถ้า verified แล้วไม่ต้องแสดง dialog

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
          disabled={isLoadingRequest}
          className="flex justify-center items-center gap-2"
        >
          {isLoadingRequest ? <>กำลังส่ง...</> : <span>ขอรหัส OTP</span>}
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
          {/* <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel> */}
          <AlertDialogCancel onClick={() => router.push("/")}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPDialog;
