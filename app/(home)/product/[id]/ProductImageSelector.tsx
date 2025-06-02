import SliderContainer from "@/components/shared/SliderContainer";
import Image from "next/image";
import React from "react";

type Props = {
  images: string[] | null;
  setSelectedProductImage: (image: string | null) => void;
  selectedProductImage: string | null;
};
export default function ProductImageSelector({
  images,
  setSelectedProductImage,
  selectedProductImage,
}: Props) {
  return (
    <div className="mt-6">
      {images?.length ? (
        <div className="pb-8">
          <SliderContainer
            breakpoints={{
              9999: { perPage: 5, arrows: true }, // แสดงแบบเดียวกันกับทุกหน้าจอ
            }}
          >
            {images?.map((img, i) => (
              <div key={i} className="">
                <Image
                  key={i}
                  src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${img}`}
                  width={200}
                  height={200}
                  alt={`thumb-${i}`}
                  onMouseOver={() => setSelectedProductImage(img)}
                  className={`w-full h-full object-contain rounded border ${
                    selectedProductImage === img
                      ? "border-orange-500"
                      : "border-gray-300"
                  } cursor-pointer`}
                />
              </div>
            ))}
          </SliderContainer>
        </div>
      ) : null}
    </div>
  );
}
