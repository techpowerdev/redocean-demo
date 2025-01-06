import axios from "axios";
import apiClient from "./apiClient";
import { LineLoginType, LoginType, SignUpType } from "@/types/userTypes";

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
      throw new Error(error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
export async function getCurrentUser() {
  try {
    const response = await apiClient.get(`/users/current-user`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ไม่มีสิทธิ์เข้าถึง");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
export async function logoutUser() {
  try {
    const response = await apiClient.get(`/logout`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ออกจากระบบไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function verifyUser(
  phoneNumber: string,
  phoneVerified: boolean = true
) {
  try {
    const response = await apiClient.put(`/verify-user`, {
      phoneNumber,
      phoneVerified,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ยืนยันตัวตนไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
