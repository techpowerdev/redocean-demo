"use client";

import { EditCategoryForm } from "@/app/features/category/forms/EditCategoryForm";
import PageTitle from "@/components/shared/PageTitle";
import { getCategoryById } from "@/services/categoryServices";
import { GetCategoryByIdResponse } from "@/types/categoryTypes";
import React, { useEffect, useState } from "react";

type Props = {
  params: {
    id: string;
  };
};

export default function EditCategoryPage({ params }: Props) {
  const [category, setCategory] = useState<
    GetCategoryByIdResponse["data"] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      const category = await getCategoryById(params.id);

      setCategory(category.data);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <PageTitle title="แก้ไขหมวดหมู่สินค้า" className="mb-4" />
      {category ? (
        <EditCategoryForm category={category} />
      ) : (
        <div className="text-red-500">ไม่พบหมวดหมู่สินค้านี้</div>
      )}
    </div>
  );
}
