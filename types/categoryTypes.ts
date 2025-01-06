import { ProductType } from "./productTypes";

// types based on the prisma schema
export type CategoryType = {
  id: string;
  name: string;

  products?: ProductType[] | null;
};
// end of types based on the prisma schema

// types for the client side
