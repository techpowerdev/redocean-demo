import { ProductType, ProductVariantType } from "@/types/fetchTypes";
import axios, { AxiosResponse } from "axios";

// export const getAllProducts = async (): Promise<AxiosResponse<
//   ProductType[]
// > | null> => {
//   try {
//     const result = await axios.get<ProductType[]>(
//       `${process.env.NEXT_PUBLIC_API_URL}/products/all`
//     );
//     return result;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

export const getAllProducts = async () => {
  try {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/all`
    );
    console.log("product data=>", result);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const getProductById = async (productId: string) => {
  try {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
    );
    console.log(result);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (
  productId: string
): Promise<AxiosResponse<ProductType> | null> => {
  try {
    const result = await axios.delete<ProductType>(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`
    );
    return result;
  } catch (error) {
    console.log(error);
    return null;
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

// export const getProductVariantStock = async (variantId: string) => {
//   try {
//     const { data } = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_URL}/products/variants/stock/${variantId}`
//     );
//     return data.stock;
//   } catch (error) {
//     console.log(error);
//   }
// };

// export const searchProductVariant = async (
//   productId: string,
//   selectedOptions: Record<string, string | undefined>
// ) => {
//   try {
//     const isSelectedOptionsEmpty = Object.values(selectedOptions).every(
//       (value) => typeof value === "string" && value === ""
//     );

//     if (isSelectedOptionsEmpty) {
//       const data = await getProductById(productId);
//       return data;
//     }

//     // search variant
//     const query = new URLSearchParams();

//     if (selectedOptions?.color) query.append("color", selectedOptions.color);
//     if (selectedOptions?.size) query.append("size", selectedOptions.size);

//     const { data } = await axios.get(
//       `${
//         process.env.NEXT_PUBLIC_API_URL
//       }/products/${productId}/variants/search/q?${query.toString()}`
//     );

//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// };

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
