import CreatePromotionForm from "@/app/features/promotion/forms/CreatePromotionForm";
import PageTitle from "@/components/shared/PageTitle";
import React from "react";

export default function CreatePromotionPage() {
  return (
    <div className="p-4">
      <PageTitle title="เพิ่มกิจกรรม" className="mb-4" />
      <CreatePromotionForm />
    </div>
  );
}
