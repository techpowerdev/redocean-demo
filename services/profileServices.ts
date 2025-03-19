import axios from "axios";
import apiClient from "./apiClient";
import { EditProfileParam, EditProfileResponse } from "@/types/userTypes";

export async function editProfile(
  profileData: EditProfileParam
): Promise<EditProfileResponse> {
  try {
    const response = await apiClient.put(`/users/change-profile`, profileData);
    return response.data; // ส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error);
      throw new Error(error.response?.data?.message || "แก้ไขไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
