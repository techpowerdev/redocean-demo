import { ProductVariantType } from "@/types/fetchTypes";
import axios, { AxiosResponse } from "axios";
import apiClient from "./apiClient";
import { CreateProductType } from "@/types/productTypes";

export const createProduct = async (ProductData: CreateProductType) => {
  try {
    const result = await apiClient.post(`/products`, ProductData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มสินค้าแล้ว");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllProducts = async () => {
  try {
    const result = await apiClient.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/all`
    );
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getProductById = async (productId: string) => {
  try {
    const result = await apiClient.get(`/products/${productId}`);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const result = await apiClient.delete(`/products/${productId}`);
    return result.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteProductVariant = async (
  productVariantId: string
): Promise<AxiosResponse<ProductVariantType> | null> => {
  try {
    const result = await axios.delete<ProductVariantType>(
      `${process.env.NEXT_PUBLIC_API_URL}/products/variants/${productVariantId}`
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const searchProductVariant = async (
  productId: string,
  selectedOptions: Record<string, string | undefined>
) => {
  try {
    // ตรวจสอบว่า selectedOptions เป็นค่าว่างหรือไม่
    const isSelectedOptionsEmpty = Object.values(selectedOptions).every(
      (value) => typeof value === "string" && value === ""
    );

    if (isSelectedOptionsEmpty) {
      // หากไม่มีการเลือกตัวเลือกให้ดึงข้อมูลผลิตภัณฑ์
      const data = await getProductById(productId);
      return data;
    }

    // สร้าง query string สำหรับส่งไปยัง API
    const query = new URLSearchParams();

    // ถ้ามี selectedOptions ให้แปลงเป็น JSON และเพิ่มใน query
    if (Object.keys(selectedOptions).length > 0) {
      query.append("variantOptions", JSON.stringify(selectedOptions));
    }

    // ส่งคำขอ API พร้อม query string
    const { data } = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/products/${productId}/variants/search/q?${query.toString()}`
    );

    console.log("data", data);
    // ส่งข้อมูลที่ได้จาก API
    return data;
  } catch (error) {
    console.error("Error fetching product variants:", error);
    throw error; // สามารถ throw error ไปยังตัวเรียกฟังก์ชันเพื่อจัดการได้
  }
};
