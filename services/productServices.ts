import axios from "axios";
import authAxios from "@/lib/authAxios";
import {
  CheckProductAvailabilityForUserResponse,
  GetAllProductsResponse,
  GetAllProductsForSellResponse,
  GetProductByIdResponse,
  GetOneProductForSellResponse,
  CreateProductResponse,
  UpdateProductResponse,
  CreateProductVariantResponse,
  UpdateProductVariantResponse,
  CheckProductAvailabilityForUserParams,
  CreateProductParams,
  UpdateProductParams,
  CreateProductVariantParams,
  UpdateProductVariantParams,
  CreateProductWithVariantsParams,
  CreateProductWithVariantsResponse,
  EditProductWithVariantsParams,
  EditProductWithVariantsResponse,
  GetProductItemByIdResponse,
  GetAllProductItemsResponse,
} from "@/types/productTypes";

export const createProductWithVariants = async (
  data: CreateProductWithVariantsParams
): Promise<CreateProductWithVariantsResponse> => {
  try {
    const response = await authAxios.post(`/product/items`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getProductItemById = async (
  productItemId: string
): Promise<GetProductItemByIdResponse> => {
  try {
    const response = await authAxios.get(`/product/items/${productItemId}`);
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

export const getAllProductItems =
  async (): Promise<GetAllProductItemsResponse> => {
    try {
      const response = await authAxios.get(`/product/items`);
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

export const editProductWithVariants = async (
  productItemId: string,
  data: EditProductWithVariantsParams
): Promise<EditProductWithVariantsResponse> => {
  try {
    const response = await authAxios.patch(
      `/product/items/${productItemId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteProductItem = async (
  productItemId: string
): Promise<void> => {
  try {
    const response = await authAxios.delete(`/product/items/${productItemId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
export const createProduct = async (
  data: CreateProductParams
): Promise<CreateProductResponse> => {
  try {
    const response = await authAxios.post(`/products`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "เพิ่มสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const getAllProducts = async (
  search?: string,
  page?: number,
  pageSize?: number,
  sortBy?: string,
  sortOrder?: string,
  productCategoryId?: string,
  isActive?: boolean
): Promise<GetAllProductsResponse> => {
  try {
    // สร้าง params object สำหรับ query string
    const params = {
      search,
      page,
      pageSize,
      sortBy,
      sortOrder,
      productCategoryId,
      isActive,
    };

    // ทำการส่ง HTTP GET request พร้อม query parameters
    const response = await authAxios.get(`/products`, { params });

    // ส่งข้อมูลที่ได้จาก response กลับไป
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
    const response = await authAxios.get(`/products/${productId}`);
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
  data: UpdateProductParams
): Promise<UpdateProductResponse> => {
  try {
    const response = await authAxios.patch(`/products/${id}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "แก้ไขสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};

export const deleteProduct = async (productId: string): Promise<void> => {
  try {
    const response = await authAxios.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "ลบสินค้าไม่สำเร็จ");
    }
    throw new Error("เกิดข้อผิดพลาดบางอย่าง");
  }
};
// End of product

// specific for user
export const getAllProductForSell =
  async (): Promise<GetAllProductsForSellResponse> => {
    try {
      const response = await authAxios.get(`/products/for-sell/all`);
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
): Promise<GetOneProductForSellResponse> => {
  try {
    const response = await authAxios.get(`/products/for-sell/${productId}`);
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
export const createProductVariant = async (
  data: CreateProductVariantParams
): Promise<CreateProductVariantResponse> => {
  try {
    const response = await authAxios.post(`/product-variants`, data);
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
  data: UpdateProductVariantParams
): Promise<UpdateProductVariantResponse> => {
  try {
    const response = await authAxios.patch(`/product-variants/${id}`, data);
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

export const deleteProductVariant = async (
  productVariantId: string
): Promise<void> => {
  try {
    const response = await authAxios.delete(
      `/product-variants/${productVariantId}`
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
    const response = await authAxios.get(
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
  data: CheckProductAvailabilityForUserParams
): Promise<{
  data: CheckProductAvailabilityForUserResponse;
  message?: string | null;
}> => {
  try {
    const response = await authAxios.post(
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
