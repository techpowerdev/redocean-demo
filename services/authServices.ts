import axios from "axios";
import authAxios from "@/lib/authAxios";
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
import publicAxios from "@/lib/publicAxios";

export async function signUp(signUpData: SignUpParam): Promise<SignUpResponse> {
  try {
    const response = await publicAxios.post(`/auth/register`, signUpData);
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

export async function login(loginData: LoginParam): Promise<LoginResponse> {
  try {
    const response = await publicAxios.post(`/auth/login`, loginData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("axios error:", error.response?.data);
      throw new Error(
        error.response?.data?.message || "อีเมล หรือรหัสผ่านไม่ถูกต้อง"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function lineLogin(
  lineLoginData: LineLoginParam
): Promise<LineLoginResponse> {
  try {
    const response = await publicAxios.post(
      `/auth/lineliff/login`,
      lineLoginData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function getCurrentUser(): Promise<GetCurrentUserResponse> {
  try {
    const response = await authAxios.get(`/users/profile`);
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
    const response = await authAxios.post(`/logout`, { refreshToken });
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
): Promise<VerifyUserResponse> {
  try {
    const response = await authAxios.patch(
      `/users/verify-user`,
      verifyUserData
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ยืนยันตัวตนไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}

export async function test() {
  try {
    const response = await authAxios.get(`/auth/protected`);
    console.log("Test response:", response);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // throw new Error(error.response?.data?.message || "เข้าสู่ระบบไม่สำเร็จ");
      throw new Error("อีเมล หรือรหัสผ่านไม่ถูกต้อง");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
