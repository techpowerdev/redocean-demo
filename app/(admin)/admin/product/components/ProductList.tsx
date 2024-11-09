"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
// import ToggleBooleanField from "./ToggleBooleanField";
// import { Flame } from "lucide-react";
import Image from "next/image";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import { Product } from "@/types/types";
import Loading from "@/components/shared/Loading";

type Products = Product[];

interface Props {
  items: Products | null;
}

const apiURL = process.env.NEXT_PUBLIC_IMAGE_HOST_URL;

export function ProductList({ items }: Props) {
  const selectProduct = useProductStore((state) => state.selectProduct);
  const selectedProduct = useProductStore((state) => state.selectedProduct);

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items?.length ? (
          items?.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm cursor-pointer transition-all hover:bg-accent",
                selectedProduct?.id === item.id && "bg-muted"
              )}
            >
              <div
                className="flex w-full flex-col gap-1"
                onClick={() => selectProduct(item)}
              >
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.name}</div>
                    {item.hotDeal ? (
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                    ) : (
                      <span className="flex h-2 w-2 rounded-full bg-red-400" />
                    )}
                  </div>
                  <div className="ml-auto text-xs">
                    {formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_20%] gap-2">
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {item.description.substring(0, 200)}
                  </div>
                  {item.images?.[0]?.url && (
                    <div className="relative w-full aspect-square">
                      <Image
                        fill
                        src={`${apiURL + item.images[0].url}`}
                        alt={item.images[0].id}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* <ToggleBooleanField
                initialStatus={item.hotDeal}
                fieldName="hotDeal"
                icon={Flame}
                apiEndpoint={`${process.env.NEXT_PUBLIC_API_URL}/products/${item.id}/toggle-hot-deal`} // ปรับ Endpoint ให้ตรงกับสินค้า
                id={item.id} // ส่งค่า ID ที่ถูกต้อง
                label="Hot Deal"
              /> */}
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </ScrollArea>
  );
}
// "use client";

// import { formatDistanceToNow } from "date-fns";
// import { cn } from "@/lib/utils";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import ToggleBooleanField from "./ToggleBooleanField";
// import { Flame } from "lucide-react";
// import Image from "next/image";
// import { useProductStore } from "@/state-stores/admin/adminProductStore";
// import { Product } from "@/types/types";
// import { useEffect } from "react";
// import axios from "axios";

// const apiURL = process.env.NEXT_PUBLIC_IMAGE_HOST_URL;

// export function ProductList() {
//   const selectProduct = useProductStore((state) => state.selectProduct);
//   const selectedProduct = useProductStore((state) => state.selectedProduct);
//   const productLists = useProductStore((state) => state.productLists);
//   const setProductLists = useProductStore((state) => state.setProductLists);

//   useEffect(() => {
//     console.log("use Effect");
//     const getAllProducts = async () => {
//       try {
//         const { data } = await axios.get(
//           `${process.env.NEXT_PUBLIC_API_URL}/products`
//         );
//         setProductLists(data);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };
//     getAllProducts();
//   }, [setProductLists]);
//   return (
//     <ScrollArea className="h-[calc(100vh-180px)]">
//       <div className="flex flex-col gap-2 p-4 pt-0">
//         {productLists?.length ? (
//           productLists?.map((item) => (
//             <div
//               key={item.id}
//               onClick={() => selectProduct(item)}
//               className={cn(
//                 "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm cursor-pointer transition-all hover:bg-accent",
//                 selectedProduct?.id === item.id && "bg-muted"
//               )}
//             >
//               <div className="flex w-full flex-col gap-1">
//                 <div className="flex items-center">
//                   <div className="flex items-center gap-2">
//                     <div className="font-semibold">{item.name}</div>
//                     {item.isActive ? (
//                       <span className="relative flex h-3 w-3">
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                         <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//                       </span>
//                     ) : (
//                       <span className="flex h-2 w-2 rounded-full bg-red-400" />
//                     )}
//                   </div>
//                   <div className="ml-auto text-xs">
//                     {formatDistanceToNow(new Date(item.createdAt), {
//                       addSuffix: true,
//                     })}
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-[1fr_20%] gap-2">
//                   <div className="line-clamp-2 text-xs text-muted-foreground">
//                     {item.description.substring(0, 300)}
//                   </div>
//                   {item.images?.[0]?.url && (
//                     <div className="relative w-full aspect-square">
//                       <Image
//                         fill
//                         src={`${apiURL + item.images[0].url}`}
//                         alt={item.images[0].id}
//                         className="object-contain"
//                         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//               <ToggleBooleanField
//                 initialStatus={item.isActive}
//                 fieldName="hotDeal"
//                 icon={Flame}
//                 apiEndpoint={`/api/products/${item.id}/toggle-hot-deal`} // ปรับ Endpoint ให้ตรงกับสินค้า
//                 id={item.id} // ส่งค่า ID ที่ถูกต้อง
//                 label="Hot Deal"
//               />
//             </div>
//           ))
//         ) : (
//           <div>test</div>
//         )}
//       </div>
//     </ScrollArea>
//   );
// }
