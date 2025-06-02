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
  }, [params.id]);

  if (!category) {
    return (
      <div className="text-red-500 flex justify-center items-center h-screen">
        ไม่พบหมวดหมู่สินค้านี้
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageTitle title="แก้ไขหมวดหมู่สินค้า" className="mb-4" />
      <EditCategoryForm category={category} />
    </div>
  );
}
