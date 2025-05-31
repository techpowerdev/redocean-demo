import { ProductCategory } from "@/types/baseTypes";

export type CreateCategoryParams = {
  name: string;
};
export type CreateCategoryResponse = { data: ProductCategory };

export type GetAllCategoriesResponse = { data: ProductCategory[] };

export type GetCategoryByIdResponse = { data: ProductCategory };

export type UpdateCategoryParams = {
  name: string;
};
export type UpdateCategoryResponse = { data: ProductCategory };
