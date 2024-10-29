// "use client";

// import { formatDistanceToNow } from "date-fns";
// import { cn } from "@/lib/utils";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Flame } from "lucide-react";
// import Image from "next/image";
// import { useProductStore } from "@/state-stores/admin/adminProductStore";
// import { Product } from "@/types/types";
// import Loading from "@/components/shared/Loading";
// import ToggleBooleanField from "../../product/components/ToggleBooleanField";

// // type Products = Product[];

// // interface Props {
// //   items: Products | null;
// // }

// const apiURL = process.env.NEXT_PUBLIC_IMAGE_HOST_URL;

// // export function EventItemList({ items }: Props) {
// export function EventItemList() {
//   const productLists = useProductStore((state) => state.productLists);
//   const eventProduct = productLists?.filter((item) => item.isActive == true);

//   // if (!eventProduct) {
//   //   <Loading />;
//   // }
//   return (
//     <ScrollArea className="h-[calc(100vh-180px)]">
//       <div className="flex flex-col gap-2 p-4 pt-0">
//         {eventProduct?.length &&
//           eventProduct?.map((item) => (
//             <div
//               key={item.id}
//               className={cn(
//                 "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm cursor-pointer transition-all hover:bg-accent"
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
//                 fieldName="isActive"
//                 icon={Flame}
//                 apiEndpoint={`${process.env.NEXT_PUBLIC_API_URL}/products/${item.id}/toggle-hot-deal`} // ปรับ Endpoint ให้ตรงกับสินค้า
//                 id={item.id} // ส่งค่า ID ที่ถูกต้อง
//                 label="Hot Deal"
//               />
//             </div>
//           ))}
//       </div>
//     </ScrollArea>
//   );
// }
"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";
import Image from "next/image";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import Loading from "@/components/shared/Loading";
import ToggleBooleanField from "../../product/components/ToggleBooleanField";

const apiURL = process.env.NEXT_PUBLIC_IMAGE_HOST_URL;

export function EventItemList() {
  const productLists = useProductStore((state) => state.productLists);
  const isLoading = productLists === undefined; // Adjust loading condition
  const eventProduct = productLists?.filter((item) => item.isActive === true);

  if (isLoading) return <Loading />;

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {eventProduct?.length ? (
          eventProduct.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm cursor-pointer transition-all hover:bg-accent"
              )}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">{item.name}</div>
                    {item.isActive ? (
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
                    {item.description.substring(0, 300)}
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
              <ToggleBooleanField
                initialStatus={item.isActive}
                fieldName="isActive"
                icon={Flame}
                apiEndpoint={`${process.env.NEXT_PUBLIC_API_URL}/products/${item.id}/toggle-hot-deal`}
                id={item.id}
                label="Hot Deal"
              />
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            ยังไม่มีสินค้าในรายการ
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
