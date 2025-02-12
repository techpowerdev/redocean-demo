import axios from "axios";
import apiClient from "./apiClient";
import {
  SignUpParam,
  SignUpResponse,
  LoginParam,
  LoginResponse,
  LineLoginParam,
  LineLoginResponse,
  GetCurrentUserResponse,
  VerifyUserParam,
  VerifyUserResponse,
} from "@/types/userTypes";

export async function signUp(
  signUpData: SignUpParam
): Promise<{ data: SignUpResponse; message: string }> {
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

export async function login(
  loginData: LoginParam
): Promise<{ data: LoginResponse; message: string }> {
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

export async function lineLogin(
  lineLoginData: LineLoginParam
): Promise<{ data: LineLoginResponse; message: string }> {
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

export async function getCurrentUser(): Promise<{
  data: GetCurrentUserResponse;
}> {
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

export async function logoutUser(
  refreshToken?: string
): Promise<{ message: string }> {
  try {
    const response = await apiClient.post(`/logout`, { refreshToken });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ออกจากระบบไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function verifyUser(
  verifyUserData: VerifyUserParam
): Promise<{ data: VerifyUserResponse }> {
  try {
    const response = await apiClient.put(`/verify-user`, verifyUserData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ยืนยันตัวตนไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
