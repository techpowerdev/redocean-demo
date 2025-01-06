import axios from "axios";
import apiClient from "./apiClient";
import { EditProfileType } from "@/types/userTypes";

export async function editProfile(profileData: EditProfileType) {
  try {
    const response = await apiClient.put(`/users/change-profile`, profileData);
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
