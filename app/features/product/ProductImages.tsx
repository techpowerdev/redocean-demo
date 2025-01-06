// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// type Props = {
//   images: string[] | undefined;
//   selectedVariantImage: string | null;
// };

// export default function ProductImage({ images, selectedVariantImage }: Props) {
//   // ตรวจสอบว่า images มีค่าและไม่เป็น array ว่าง
//   const [selectedImage, setSelectedImage] = useState("");

//   const handleChangeImage = (image: string) => {
//     if (selectedVariantImage) {
//       setSelectedImage(selectedVariantImage);
//     } else {
//       setSelectedImage(image);
//     }
//   };

//   useEffect(() => {
//     handleChangeImage(images?.[0] || "");
//   }, [images, selectedVariantImage]);

//   return (
//     <div className="grid grid-cols-[20%_80%] gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
//       {/* Thumbnail List */}
//       <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full overflow-y-auto">
//         {images
//           ?.filter((image) => image) // Exclude null or undefined values
//           .map((image, index) => (
//             <div
//               key={index}
//               onClick={() => handleChangeImage(image)}
//               className={`relative w-[80%] aspect-square rounded border-teal-300
//               ${
//                 selectedImage === image
//                   ? "border-[2px] border-teal-500"
//                   : "border-none"
//               }`}
//             >
//               <Image
//                 priority
//                 src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${image || ""}`} // ใช้รูป placeholder หากไม่มีภาพ
//                 alt={`Product Image ${index + 1}`}
//                 fill
//                 className="object-contain rounded"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//               />
//             </div>
//           ))}
//       </div>

//       {/* Selected Image Display */}
//       <div className="relative aspect-square ml-1">
//         {selectedImage ? (
//           <Image
//             priority
//             fill
//             src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${
//               selectedImage || ""
//             }`}
//             alt="Selected Product"
//             className="w-full h-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px] rounded"
//             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           />
//         ) : (
//           <div className="flex items-center justify-center w-full h-full bg-gray-200">
//             <p>No Image Available</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

//

"use client";
import { ProductType, ProductVariantType } from "@/types/productTypes";
import Image from "next/image";
import { useEffect, useState } from "react";

type Props = {
  product: ProductType;
  variants: ProductVariantType[] | null | undefined; // ส่ง array ของ variant object
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
