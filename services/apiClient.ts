// version 1
// import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
// import axios from "axios";

// // สร้าง Axios Instance
// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // เพิ่ม interceptor เพื่อใส่ token และตรวจสอบ expired
// apiClient.interceptors.request.use((config) => {
//   const token = useCurrentUserStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });

// // Handle responses (เช็ค 401 Unauthorized)
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       useCurrentUserStore.getState().setToken(null); // ลบ token ออกจาก store
//       if (typeof window !== "undefined") {
//         // ใช้ window location แทน router.push
//         window.location.href = "/login-line-liff";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;

// version 2 : use token from cookie
// ใช้ได้กับ client component เท่านั้น ถ้ามีการเรียก api ที่ server component ได้ไม่มี token ใน cookie ส่งไปด้วย (อาจต้องใช้ middleware ช่วยได้ ?)

// import axios from "axios";

// // สร้าง Axios Instance
// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // ใช้ cookie ในการส่ง token
// });

// // Handle responses (เช็ค 401 Unauthorized)
// // apiClient.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response?.status === 401) {
// //       if (typeof window !== "undefined") {
// //         // ใช้ window location แทน router.push
// //         window.location.href = "/login-line-liff";
// //       }
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// export default apiClient;

// @@@@@@@ Authentication session @@@@@@@@@@
// @@@@@@@ authorization with cookie-based
// import axios from "axios";
// // ✅ สร้าง Axios instance ที่ส่ง cookie ไปกับคำขอทุกครั้ง
// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true, // <== สำคัญ! เพื่อให้ cookie ถูกส่งไปด้วย
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ ดักจับ response ที่หมดอายุ
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         // ขอ refresh token จาก backend
//         await apiClient.post("/auth/refresh"); // ต้องมี endpoint นี้ใน backend

//         // ลองส่งคำขอเดิมอีกครั้ง
//         return apiClient(originalRequest);
//       } catch (refreshError) {
//         console.error("Refresh token failed:", refreshError);
//         // logout / redirect ไป login ถ้าจำเป็น
//         if (typeof window !== "undefined") {
//           window.location.href = "/login-line-liff";
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );
// export default apiClient;

// @@@@@@@ authorization as Bearer token
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
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 👉 Interceptor: เพิ่ม token ก่อนส่ง request
apiClient.interceptors.request.use(async (config) => {
  const session = await getSession();
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
apiClient.interceptors.response.use(
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
        console.log("newAccessToken : ", newAccessToken);
        // อัปเดต session
        if (newAccessToken) {
          await createSession({
            ...session,
            accessToken: newAccessToken,
          });

          // ตั้ง Authorization ใหม่และลองส่ง request เดิมอีกครั้ง
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
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

export default apiClient;
