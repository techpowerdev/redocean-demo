"use client";

import { getProductById } from "@/services/productServices";
import { FetchOneProductResponseType, ProductType } from "@/types/productTypes";
import React, { useEffect, useState } from "react";
import { EditProductForm } from "./EditProductForm";

type Props = {
  params: { id: string };
};

export default function page({ params }: Props) {
  const [product, setProduct] = useState<ProductType | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      const product: FetchOneProductResponseType = await getProductById(
        params.id
      );
      setProduct(product.data);
    };
    fetchProduct();
  }, []);
  return <div>{product && <EditProductForm product={product} />}</div>;
}
