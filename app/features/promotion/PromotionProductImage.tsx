"use client";
import Image from "next/image";
import { useState } from "react";
interface ProductImageProps {
  images: string[] | undefined;
}

export default function PromotionProductImage({ images }: ProductImageProps) {
  const [selectedImage, setSelectedImage] = useState(images?.[0] || "");

  return (
    <div className="grid grid-cols-[20%_80%] gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      {/* Thumbnail List */}
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full overflow-y-auto">
        {images
          ?.filter((image) => image) // Exclude null or undefined values
          .map((image, index) => (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative w-[80%] aspect-square rounded border-teal-300 
              ${
                selectedImage === image
                  ? "border-[2px] border-teal-500"
                  : "border-none"
              }`}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${image || ""}`} // ใช้รูป placeholder หากไม่มีภาพ
                alt={`Product Image ${index + 1}`}
                fill
                className="object-contain rounded"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
      </div>

      {/* Selected Image Display */}
      <div className="relative aspect-square ml-1">
        {selectedImage ? (
          <Image
            fill
            src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${
              selectedImage || ""
            }`}
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
