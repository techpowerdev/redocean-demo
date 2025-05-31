"use client";

import { getProductItemById } from "@/services/productServices";
import { ProductItem } from "@/types/baseTypes";
import React, { useEffect, useState } from "react";
// import PageTitle from "@/components/shared/PageTitle";
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
      console.log("fetch product form useEffect", product);
    };

    fetchProduct();
  }, [params.id]);
  return (
    <div className="p-4">
      {/* <PageTitle title="แก้ไขสินค้า" className="mb-4" /> */}
      {productItem && <EditProductWithVariantsForm productItem={productItem} />}
    </div>
  );
}
