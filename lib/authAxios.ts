import { refreshToken } from "@/lib/auth";
import { getSession, createSession } from "@/lib/session";
import axios from "axios";

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    const current = window.location.pathname;
    if (!current.startsWith("/login")) {
      window.location.href = `/login?callback=${current}`;
    }
  }
};

// สร้าง Axios Instance
const authAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 Interceptor: เพิ่ม token ก่อนส่ง request
authAxios.interceptors.request.use(async (config) => {
  const session = await getSession();
  console.log("session :axios == ", session);
  if (!session || !session.accessToken) {
    setTimeout(() => {
      redirectToLogin();
    }, 10); // หรือแม้แต่ 0 ก็พอ
  }

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

// 👉 Interceptor: ดักจับ 401 และลอง refresh token
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ห้ามวนลูป refresh ซ้ำ
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const session = await getSession();
      if (!session?.refreshToken) {
        return Promise.reject("No refresh token available");
      }

      try {
        const newAccessToken = await refreshToken(session.refreshToken);
        console.log("newAccessToken :axios == ", newAccessToken);

        // อัปเดต session
        if (newAccessToken) {
          await createSession({
            ...session,
            accessToken: newAccessToken,
          });

          // ตั้ง Authorization ใหม่และลองส่ง request เดิมอีกครั้ง
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return authAxios(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // redirect ไป login ได้ที่นี่ถ้าต้องการ
        setTimeout(() => {
          redirectToLogin();
        }, 10);
      }
    }

    return Promise.reject(error);
  }
);

export default authAxios;
