import { getProductById } from "@/services/productServices";
import { FetchOneProductResponseType } from "@/types/productTypes";
import React from "react";
import EditProductForm from "./EditProductForm";

type Props = {
  params: { id: string };
};

export default async function page({ params }: Props) {
  const product: FetchOneProductResponseType = await getProductById(params.id);
  return (
    <div>
      <EditProductForm product={product.data} />
    </div>
  );
}
