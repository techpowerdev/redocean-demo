import axios from "axios";

// สร้าง Axios Instance
const publicAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicAxios;
