"use client";

import React, { useState } from "react";
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

// interface OTPDialogProps {
//   onClose: () => void; // เพิ่ม prop นี้
// }

// const OTPDialog: React.FC<OTPDialogProps> = ({ onClose }) => {
const OTPDialog = () => {
  const { isVerified, setIsVerified } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verifyToken, setVerifyToken] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const response = await axios.post(
        "https://apicall.deesmsx.com/v1/otp/request",
        body
      );
      console.log("requestOTP:", response);
      setVerifyToken(response.data.result.token);
      toast.success("OTP sent to your phone!");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message);
      } else {
        toast.error("Failed to send OTP");
      }
    } finally {
      setIsLoading(false);
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
      setIsLoading(true);
      const response = await axios.post(
        "https://apicall.deesmsx.com/v1/otp/verify",
        body
      );
      console.log("verifyOTP:", response);
      if (response.data.code == 0 && response.data.msg == "Verify Success") {
        setIsVerified(true);
        // await axios.put("/api/update-phone-number", { phoneNumber });
        // onClose();
        toast.success("ยืนยันตัวตนสำเร็จ!");
      } else {
        toast.error("รหัส OTP ไม่ถูกต้อง");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0]?.message);
      } else {
        toast.error("การยืนยันตัวตนไม่สำเร็จ");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified) return null; // ถ้า verified แล้วไม่ต้องแสดง dialog

  return (
    <AlertDialog
      open={true}
      // onOpenChange={onClose}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Verify Phone Number</AlertDialogTitle>
          <AlertDialogDescription>
            Please enter your phone number and verify with the OTP.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          type="tel"
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="mb-4"
        />
        <Button onClick={requestOtp} disabled={isLoading}>
          Request OTP
        </Button>

        <Input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="mb-4"
        />
        <Button onClick={verifyOtp} disabled={isLoading}>
          Verify OTP
        </Button>

        <AlertDialogFooter>
          {/* <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel> */}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OTPDialog;
