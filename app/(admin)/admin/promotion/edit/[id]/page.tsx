"use client";

import { getPromotionById } from "@/services/promotionServices";
import {
  FetchOnePromotionResponseType,
  PromotionType,
} from "@/types/promotionTypes";
import React, { useEffect, useState } from "react";
import { EditPromotion } from "./EditPromotionForm";

type Props = {
  params: { id: string };
};

export default function page({ params }: Props) {
  const [promotion, setPromotion] = useState<PromotionType | null>(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      const promotion: FetchOnePromotionResponseType = await getPromotionById(
        params.id
      );
      setPromotion(promotion.data);
    };
    fetchPromotion();
  }, []);

  return <div>{promotion && <EditPromotion promotion={promotion} />}</div>;
}
