"use client";

import { getPromotionById } from "@/services/promotionServices";
import { Promotion } from "@/types/baseTypes";
import React, { useEffect, useState } from "react";
import PageTitle from "@/components/shared/PageTitle";
import { EditPromotionForm } from "@/app/features/promotion/forms/EditPromotionForm";

type Props = {
  params: { id: string };
};

export default function EditPromotionPage({ params }: Props) {
  const [promotion, setPromotion] = useState<Promotion | null>(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      const promotion = await getPromotionById(params.id);
      setPromotion(promotion.data);
    };
    fetchPromotion();
  }, [params.id]);

  return (
    <div className="p-4">
      <PageTitle title="แก้ไขกิจกรรม" className="mb-4" />
      {promotion && <EditPromotionForm promotion={promotion} />}
    </div>
  );
}
