"use client";
import { Product, ProductVariant } from "@/types/baseTypes";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  product: Product;
  variants: ProductVariant[] | null | undefined; // ส่ง array ของ variant object
  selectedOption: Record<string, string | undefined>; // ส่งเฉพาะ option ที่เลือก เช่น { "สี": "เขียว", "ขนาด": "190 กรัม" }
};

export default function ProductImage({
  product,
  variants,
  selectedOption,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // หาภาพที่ตรงกับ selectedOption (match ทุก key-value ที่เลือก)
  useEffect(() => {
    if (!variants || variants.length === 0) {
      setSelectedImage(product.image || null); // กรณีไม่มี variants
      return;
    }

    // หา variant ที่ match กับ selectedOption
    const matchedVariant = variants.find((variant) =>
      Object.entries(selectedOption)
        .filter(([, value]) => value !== undefined) // กรองเฉพาะ key-value ที่มีการเลือก
        .every(([key, value]) => variant.variantOptions[key] === value)
    );

    // หาก match หรือ fallback เป็นรูปแรก
    setSelectedImage(
      matchedVariant?.image || variants.find((v) => v.image)?.image || null
    );
  }, [variants, selectedOption]);

  return (
    <div className="grid grid-cols-[20%_80%] gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      {/* Thumbnail List */}
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full overflow-y-auto">
        {variants
          ?.filter((variant) => variant.image)
          ?.map((variant) => (
            <div
              key={variant.id}
              onClick={() => setSelectedImage(variant.image || null)}
              className={`relative w-[80%] aspect-square rounded 
              ${
                selectedImage === variant.image
                  ? "border-2 border-teal-500"
                  : "border-none"
              }`}
            >
              {variant.image ? (
                <Image
                  priority
                  src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${variant.image}`}
                  alt={`Variant Image ${variant.sku}`}
                  fill
                  className="object-contain rounded"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-200">
                  <p>No Image</p>
                </div>
              )}
            </div>
          ))}
      </div>

      {/* Selected Image Display */}
      <div className="relative aspect-square ml-1">
        {selectedImage ? (
          <Image
            priority
            fill
            src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedImage}`}
            alt="Selected Product"
            className="w-full h-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px] rounded"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <p>No Image Available</p>
          </div>
        )}
      </div>
    </div>
  );
}
