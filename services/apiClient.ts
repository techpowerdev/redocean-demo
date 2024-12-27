// import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
// import axios from "axios";

// // สร้าง Axios Instance
// const apiClient = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // เพิ่ม interceptor เพื่อใส่ token อัตโนมัติ
// apiClient.interceptors.request.use((config) => {
//   const token = useCurrentUserStore.getState().token; // ดึง token จาก store
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default apiClient;

// version 2 : add error handle token expired
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import axios from "axios";

// สร้าง Axios Instance
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// เพิ่ม interceptor เพื่อใส่ token และตรวจสอบ expired
apiClient.interceptors.request.use((config) => {
  const token = useCurrentUserStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle responses (เช็ค 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useCurrentUserStore.getState().setToken(null); // ลบ token ออกจาก store
      if (typeof window !== "undefined") {
        // ใช้ window location แทน router.push
        window.location.href = "/login-line";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// // version 3 : use token from cookie
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
//   config.withCredentials = true; // ใช้ cookie ในการส่ง token
//   return config;
// });

// // Handle responses (เช็ค 401 Unauthorized)
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       useCurrentUserStore.getState().setToken(null); // ลบ token ออกจาก store
//       // if (typeof window !== "undefined") {
//       //   // ใช้ window location แทน router.push
//       //   window.location.href = "/login-line";
//       // }
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
