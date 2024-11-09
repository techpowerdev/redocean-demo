"use client";
import Image from "next/image";
import { useState } from "react";

interface ProductImageProps {
  images: string[];
  // handleColorSelect: (value: SelectedImgType) => void;
}
export default function EventProductImage({ images }: ProductImageProps) {
  const [selectedImage, setSelectedImage] = useState<string>(images[0]);
  return (
    <div className="grid grid-cols-[20%_80%] md:gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
      <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
        {images.map((image: string, index: number) => {
          return (
            <div
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`relative w-[80%] aspect-square rounded border-teal-300 
                ${selectedImage === image ? "border-[1.5px]" : "border-none"}
                `}
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${image}`}
                alt={image}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          );
        })}
      </div>
      <div className="relative aspect-square">
        <Image
          fill
          src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedImage}`}
          alt={""}
          className="w-full h-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}
