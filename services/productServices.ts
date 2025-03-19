import axios from "axios";
import apiClient from "./apiClient";
import {
  CheckProductAvailabilityForUserPayloadType,
  CheckProductAvailabilityForUserResponseType,
  GetAllProductResponse,
  GetProductByIdResponse,
} from "@/types/productTypes";
import { Product, ProductVariant } from "@/types/baseTypes";

// specific for user
export const getAllProductForSell = async (): Promise<{ data: Product[] }> => {
  try {
    const response = await apiClient.get(`/products/for-sell/all`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getOneProductForSell = async (
  productId: string
): Promise<{ data: Product }> => {
  try {
    const response = await apiClient.get(`/products/for-sell/${productId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

// end of specific for user

export const addProduct = async (
  formData: FormData
): Promise<{ data: Product }> => {
  try {
    const response = await apiClient.post(`/products`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllProducts = async (): Promise<GetAllProductResponse> => {
  try {
    const response = await apiClient.get(`/products/all`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getProductById = async (
  productId: string
): Promise<GetProductByIdResponse> => {
  try {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ดึงข้อมูลสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateProduct = async (
  id: string,
  formData: FormData
): Promise<{ data: Product }> => {
  try {
    const response = await apiClient.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const changeProductStatus = async (
  id: string,
  status: boolean
): Promise<{ data: Product }> => {
  try {
    const response = await apiClient.patch(`/products/change-status/${id}`, {
      isActive: status,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขสถานะสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const changeHasVariantStatus = async (
  id: string,
  status: boolean
): Promise<{ data: Product }> => {
  try {
    const response = await apiClient.patch(
      `/products/change-hasvariant-status/${id}`,
      {
        hasVariant: status,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขสถานะสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const addProductVariant = async (
  formData: FormData
): Promise<{ data: ProductVariant }> => {
  try {
    const response = await apiClient.post(`/products/variants`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "เพิ่มตัวเลือกสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const updateProductVariant = async (
  id: string,
  formData: FormData
): Promise<{ data: ProductVariant }> => {
  try {
    const response = await apiClient.put(`/products/variants/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขตัวเลือกสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const changeVariantStatus = async (
  id: string,
  status: boolean
): Promise<{ data: ProductVariant }> => {
  try {
    const response = await apiClient.patch(
      `/products/variants/change-status/${id}`,
      {
        isActive: status,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "แก้ไขสถานะตัวเลือกสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteProductVariant = async (
  productVariantId: string
): Promise<void> => {
  try {
    const response = await apiClient.delete(
      `/products/variants/${productVariantId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ลบตัวเลือกสินค้าไม่สำเร็จ"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
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
      const response = await getProductById(productId);
      return response;
    }

    // สร้าง query string สำหรับส่งไปยัง API
    const query = new URLSearchParams();

    // ถ้ามี selectedOptions ให้แปลงเป็น JSON และเพิ่มใน query
    if (Object.keys(selectedOptions).length > 0) {
      query.append("variantOptions", JSON.stringify(selectedOptions));
    }

    // ส่งคำขอ API พร้อม query string
    const response = await apiClient.get(
      `/products/${productId}/variants/search/q?${query.toString()}`
    );

    // ส่งข้อมูลที่ได้จาก API
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "ไม่สามารถค้นหาสินค้าได้"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

// validation
export const checkProductAvailabilityForUser = async (
  data: CheckProductAvailabilityForUserPayloadType
): Promise<{
  data: CheckProductAvailabilityForUserResponseType;
  message?: string | null;
}> => {
  try {
    const response = await apiClient.post(
      `/products/check-available-for-user`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "เกิดข้อผิดพลาดระหว่างตรวจสอบสินค้า"
      );
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
