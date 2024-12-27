import axios from "axios";
import apiClient from "./apiClient";
import { LineLoginType, LoginType, SignUpType } from "@/types/authTypes";

export async function signUp(signUpData: SignUpType) {
  try {
    const response = await apiClient.post(`/register`, signUpData);
    return response.data; // ส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "สมัครผู้ใช้งานไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function login(loginData: LoginType) {
  try {
    const response = await apiClient.post(`/login`, loginData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function lineLogin(lineLoginData: LineLoginType) {
  try {
    const response = await apiClient.post(`/login/line`, lineLoginData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เข้าสู่ระบบแล้ว");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
