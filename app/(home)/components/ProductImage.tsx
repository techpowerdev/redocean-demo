// "use client";

// import { CartProductType, SelectedImgType } from "@/types/product";
// // import {
// //   CartProductType,
// //   SelectedImgType,
// // } from "@/app/product/[productID]/ProductDetail";
// import Image from "next/image";

// interface ProductImageProps {
//   cartProduct: CartProductType;
//   product: {
//     id: string;
//     name: string;
//     description: string;
//     category: string;
//     brand: string;
//     images: Array<{ color: string; colorCode: string; image: string }>; // Assuming images are an array of objects with URL and alt text
//     quantity?: number; // Quantity should be a number
//     price: number;
//   };
//   handleColorSelect: (value: SelectedImgType) => void;
// }
// export default function ProductImage({
//   cartProduct,
//   product,
//   handleColorSelect,
// }: ProductImageProps) {
//   return (
//     <div className="grid grid-cols-[20%_80%] md:gap-2 h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
//       <div className="flex flex-col items-center justify-center gap-4 cursor-pointer border h-full max-h-[500px] min-h-[300px] sm:min-h-[400px]">
//         {product.images.map((image: SelectedImgType) => {
//           return (
//             <div
//               key={image.color}
//               onClick={() => handleColorSelect(image)}
//               className={`relative w-[80%] aspect-square rounded border-teal-300
//                 ${
//                   cartProduct.selectedImg.color === image.color
//                     ? "border-[1.5px]"
//                     : "border-none"
//                 }
//                 `}
//             >
//               <Image
//                 src={image.image}
//                 alt={image.color}
//                 fill
//                 className="object-contain"
//                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//               />
//             </div>
//           );
//         })}
//       </div>
//       <div className="relative aspect-square">
//         <Image
//           fill
//           src={cartProduct.selectedImg.image}
//           alt={product.name}
//           className="w-full h-full object-contain max-h-[500px] min-h-[300px] sm:min-h-[400px]"
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//         />
//       </div>
//     </div>
//   );
// }
