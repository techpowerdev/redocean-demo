"use client";

import { formatPrice } from "@/utils/formatPrice";
import React from "react";

type Props = {
  originalPrice: number;
  discountType?: string;
  discountAmount?: number;
  discountedPrice?: number;
};
export default function ProductPrice({
  originalPrice,
  discountType,
  discountAmount,
  discountedPrice,
}: Props) {
  return (
    <div>
      {discountedPrice && discountedPrice > 0 ? (
        <div className="flex flex-col gap-0">
          <span className="text-xs text-gray-500 line-through">
            {formatPrice(originalPrice)}
          </span>
          <span className="text-primary text-lg font-bold">
            {discountedPrice && formatPrice(discountedPrice)}
          </span>
        </div>
      ) : (
        <span className="text-primary text-lg font-bold">
          {formatPrice(originalPrice)}
        </span>
      )}
      <span>{discountType}</span>
      <span>{discountAmount}</span>
    </div>
  );
}
