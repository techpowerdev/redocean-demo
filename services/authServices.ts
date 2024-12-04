import axios, { AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // URL API ของคุณ

type SignUpData = {
  email: string;
  password: string;
};

type ApiResponse = {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    lineUid: string;
    displayName: string;
    pictureUrl: string;
    phoneNumber: string;
    phoneVerified: boolean;
    role: string;
  };
};

type ApiErrorResponse = {
  message: string;
};

/**
 * ฟังก์ชันสำหรับสมัครใช้งาน
 * @param signUpData ข้อมูลที่ใช้ในการสมัคร
 * @returns Promise<ApiResponse>
 */
export async function signUp(signUpData: SignUpData): Promise<ApiResponse> {
  try {
    // ส่งคำขอไปยัง API
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      `${API_URL}/register`,
      signUpData
    );
    return response.data; // ส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    // ตรวจสอบว่าข้อผิดพลาดเป็น AxiosError
    if (axios.isAxiosError(error)) {
      const apiError: ApiErrorResponse | undefined = error.response?.data;
      throw new Error(apiError?.message || "An error occurred during sign-up.");
    }
    // ข้อผิดพลาดที่ไม่ใช่ AxiosError
    throw new Error("Unexpected error occurred during sign-up.");
  }
}

/**
 * ฟังก์ชันสำหรับสมัครใช้งาน
 * @param signUpData ข้อมูลที่ใช้ในการสมัคร
 * @returns Promise<ApiResponse>
 */
export async function Login(signUpData: SignUpData): Promise<ApiResponse> {
  try {
    // ส่งคำขอไปยัง API
    const response: AxiosResponse<ApiResponse> = await axios.post<ApiResponse>(
      `${API_URL}/login`,
      signUpData
    );
    return response.data; // ส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    // ตรวจสอบว่าข้อผิดพลาดเป็น AxiosError
    if (axios.isAxiosError(error)) {
      const apiError: ApiErrorResponse | undefined = error.response?.data;
      throw new Error(apiError?.message || "An error occurred during login.");
    }
    // ข้อผิดพลาดที่ไม่ใช่ AxiosError
    throw new Error("Unexpected error occurred during login.");
  }
}
