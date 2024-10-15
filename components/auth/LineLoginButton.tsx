"use client";

import React from "react";
import { Button } from "../../../components/ui/button";
import axios from "axios";
import Link from "next/link";

type Props = {};

export default function LineLoginButton({}: Props) {
  const handleLogin = async () => {
    try {
      // ตั้งค่าที่อยู่ URL สำหรับ API ของคุณ
      const API_URL = "http://localhost:3001/auth/line"; // ปรับให้ตรงกับที่อยู่ API ของคุณ

      // ทำการเรียก API สำหรับการเข้าสู่ระบบ LINE
      const response = await axios.get(API_URL);
      // เปลี่ยนเส้นทางไปยัง URL ของ LINE login
      window.location.href = response.data.loginUrl; // สมมติว่า API ส่งกลับ URL สำหรับการเข้าสู่ระบบ LINE
    } catch (error) {
      console.error("Error during LINE login:", error);
    }
  };

  // return <Button onClick={handleLogin}>Login with LINE</Button>;
  return <Link href={"http://localhost:3001/auth/line"}>LINE LOGIN</Link>;
}
