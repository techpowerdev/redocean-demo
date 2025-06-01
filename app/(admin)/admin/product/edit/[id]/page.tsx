"use client";

import { getProductItemById } from "@/services/productServices";
import { ProductItem } from "@/types/baseTypes";
import React, { useEffect, useState } from "react";
import EditProductWithVariantsForm from "./EditProductWithVariantsForm";

type Props = {
  params: { id: string };
};

export default function EditProduct({ params }: Props) {
  const [productItem, setProductItem] = useState<ProductItem | null>(null);
  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductItemById(params.id);
      setProductItem(product.data);
    };

    fetchProduct();
  }, [params.id]);
  return (
    <div className="p-4">
      {productItem && <EditProductWithVariantsForm productItem={productItem} />}
    </div>
  );
}
