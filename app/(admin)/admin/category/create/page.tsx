import { CreateCategoryForm } from "@/app/features/category/forms/CreateCategoryForm";
import PageTitle from "@/components/shared/PageTitle";
import React from "react";

export default function CreateCategoryPage() {
  return (
    <div className="p-4">
      <PageTitle title="เพิ่มหมวดหมู่สินค้า" className="mb-4" />
      <CreateCategoryForm />
    </div>
  );
}
