"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { useProductStore } from "@/state-stores/admin/adminProductStore";
import Loading from "@/components/shared/Loading";
import { Eye } from "lucide-react";
import { Product } from "@/types/baseTypes";
import ChangeBooleanStatusField from "@/components/shared/ChangeBooleanStatusField";

interface Props {
  items: Product[] | null;
}

export function ProductList({ items }: Props) {
  const selectProduct = useProductStore((state) => state.selectProduct);
  const selectedProduct = useProductStore((state) => state.selectedProduct);
  const changeProductStatus = useProductStore(
    (state) => state.changeProductStatus
  );

  if (items?.length === 0) {
    return (
      <div className="w-full flex justify-center items-center">
        ยังไม่มีสินค้า
      </div>
    );
  }

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
                    {formatDistanceToNow(new Date(item.updatedAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_20%] gap-2">
                  <div className="line-clamp-2 text-xs text-muted-foreground">
                    {item.description.substring(0, 200)}
                  </div>
                  <div className="relative w-full aspect-square">
                    <Image
                      fill
                      src={
                        item?.image
                          ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${item.image}`
                          : item.productVariants?.[0]?.image
                          ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${item.productVariants[0].image}`
                          : "/no-image.jpg" // A fallback image path
                      }
                      alt={item?.name || "Product image"}
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </div>
              </div>

              <ChangeBooleanStatusField
                initialStatus={item.isActive}
                id={item.id}
                changeStatus={changeProductStatus}
                label="Active"
                icon={Eye}
              />
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
    </ScrollArea>
  );
}
