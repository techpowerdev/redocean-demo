import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import axios, { AxiosInstance } from "axios";

const token = useCurrentUserStore((state) => state.token);

export const publicRequest: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ใช้ค่า BASE_URL จาก environment variables
  headers: {
    "Content-Type": "application/json", // กำหนดค่า header เริ่มต้น
  },
});

export const privateRequest: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // ใช้ค่า BASE_URL จาก environment variables
  headers: {
    "Content-Type": "application/json", // กำหนดค่า header เริ่มต้น
    Authorization: `Bearer ${token}`,
  },
});
