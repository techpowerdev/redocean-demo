import axios from "axios";
import apiClient from "./apiClient";

export async function sendMessageToLine(userId: string, message: string) {
  try {
    const response = await apiClient.post(`/push-message`, {
      userId,
      message,
    });
    return response.data; // ส่งเฉพาะข้อมูลที่ได้รับจาก API
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
}
