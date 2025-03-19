"use client";

import { getProductById } from "@/services/productServices";
import { Product } from "@/types/baseTypes";
import React, { useEffect, useState } from "react";
import { EditProductForm } from "./EditProductForm";

type Props = {
  params: { id: string };
};

export default function EditProduct({ params }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(params.id);
      setProduct(product.data);
    };
    fetchProduct();
  }, []);
  return <div>{product && <EditProductForm product={product} />}</div>;
}
