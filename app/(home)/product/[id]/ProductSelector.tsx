"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ProductModel, ProductTierVariation } from "@/types/baseTypes";

type Props = {
  setSelectedProductImage: (image: string | null) => void;
  tiers: ProductTierVariation[] | null;
  models: ProductModel[] | null;
  onChange?: (model: ProductModel | null) => void;
};

export default function ProductSelector({
  setSelectedProductImage,
  tiers,
  models,
  onChange,
}: Props) {
  const hasVariants = tiers && tiers.length > 0;
  const [selection, setSelection] = useState<(number | null)[]>(
    Array(tiers?.length || 0).fill(null)
  );
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(null);

  useEffect(() => {
    if (!hasVariants) {
      // ถ้าไม่มีตัวเลือกเลย ให้ใช้โมเดลแรกเลย
      const defaultModel = models?.[0] || null;
      setSelectedModel(defaultModel);
      onChange?.(defaultModel);
      return;
    }

    const found = models?.find(
      (m) =>
        m.tierIndex?.length === selection.length &&
        m.tierIndex?.every((val, idx) => val === selection[idx])
    );
    setSelectedModel(found || null);
    onChange?.(found || null);
  }, [selection, models, onChange, hasVariants]);

  const isDisabled = (tierIdx: number, valueIdx: number) => {
    const newSelection = [...selection];
    newSelection[tierIdx] = valueIdx;
    return !models?.some(
      (m) =>
        m.tierIndex.every((val, i) => {
          return newSelection[i] === null || newSelection[i] === val;
        }) && m.stock > 0
    );
  };

  return (
    <div className="space-y-4">
      {hasVariants &&
        tiers?.map((tier, tierIdx) => (
          <div key={tierIdx}>
            <div className="font-semibold mb-2">{tier.name}</div>
            <div className="flex flex-wrap gap-2">
              {tier.values.map((opt, optIdx) => {
                const selected = selection[tierIdx] === optIdx;
                const disabled = isDisabled(tierIdx, optIdx);
                return (
                  <button
                    key={optIdx}
                    disabled={disabled}
                    onClick={() => {
                      const next = [...selection];
                      next[tierIdx] = selected ? null : optIdx;
                      setSelection(next);
                      opt.image && setSelectedProductImage(opt.image);
                    }}
                    className={`flex items-center gap-2 px-3 py-1 border rounded-lg text-sm ${
                      selected
                        ? "bg-red-50 border-primary"
                        : "bg-white hover:border-primary"
                    } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {opt.image && (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${opt.image}`}
                        alt={opt.value}
                        width={32}
                        height={32}
                        className="rounded"
                      />
                    )}
                    {opt.value}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
