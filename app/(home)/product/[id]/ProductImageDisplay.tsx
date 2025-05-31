import Image from "next/image";
import React from "react";

export default function ProductImageDisplay({
  selectedProductImage,
}: // selectedOptionImage,
{
  selectedProductImage: string | null;
  // selectedOptionImage: string | null;
}) {
  return (
    <div className="space-y-2">
      <Image
        src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${
          selectedProductImage || ""
        }`}
        width={200}
        height={200}
        alt="product-cover"
        className="w-full h-96 object-contain rounded-xl"
      />
    </div>
  );
}
