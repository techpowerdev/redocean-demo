"use client";
import { Separator } from "@/components/ui/separator";

import { useProductStore } from "@/state-stores/admin/adminProductStore";
import Image from "next/image";
import { formatPrice } from "@/utils/formatPrice";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProductDetailComponent() {
  const selectedProduct = useProductStore((state) => state.selectedProduct);

  return (
    <div className="h-full flex-1 flex flex-col justify-stretch">
      {selectedProduct ? (
        <div className="flex flex-col flex-1 ">
          <div className="grid grid-cols-[15%_1fr] gap-4 p-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="relative w-full aspect-square">
                {selectedProduct.images?.length === 0 ? (
                  <Image
                    fill
                    src={"/no-image.jpg"}
                    alt={"default image"}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <Image
                    fill
                    src={`${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${selectedProduct?.images?.[0]}`}
                    alt={selectedProduct?.name || "Product image"}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col items-start justify-between">
              <div>
                <span className="font-semibold">รหัสสินค้า : </span>{" "}
                {selectedProduct.sku}
              </div>
              <div>
                <span className="font-semibold">ชื่อสินค้า : </span>
                {selectedProduct.name}
              </div>
              <div className="flex-1 my-2 whitespace-pre-wrap text-sm">
                <span className="font-semibold">รายละเอียด : </span>
                {selectedProduct.description}
              </div>
              {!selectedProduct.hasVariants && (
                <>
                  <div>
                    <span className="font-semibold">ราคา : </span>
                    {formatPrice(selectedProduct.originalPrice)}
                  </div>
                  <div>
                    <span className="font-semibold"> จำนวนคงเหลือ : </span>
                    <span className="text-primary">
                      {selectedProduct.stock}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* end header */}
          <Separator />
          {selectedProduct.hasVariants && (
            <div className="px-4 py-2">
              <h1 className="text-xl font-bold">ตัวเลือกสินค้า</h1>
              <ScrollArea className="h-[450px] ">
                {/* product variants */}
                {selectedProduct.models?.map((model) => (
                  <div key={model.id} className="my-2 border rounded-sm">
                    <div className="grid grid-cols-[12%_1fr] items-center gap-2 p-2">
                      <div className="relative w-full aspect-square">
                        <Image
                          fill
                          src={
                            model?.image
                              ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}/${model.image}`
                              : "/no-image.png" // A fallback image path
                          }
                          alt={model?.sku || "model image"}
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-col items-start gap-2">
                        <div>
                          <span className="font-semibold">รหัสสินค้า : </span>
                          {model.sku}
                        </div>

                        <div>
                          <span className="font-semibold text-primary">
                            {model.name}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold">ราคา </span>
                          {formatPrice(model.originalPrice)}
                        </div>
                        <div>
                          <span className="font-semibold">จำนวนคงเหลือ </span>
                          <span className="text-primary">{model.stock}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          ยังไม่ได้เลือกสินค้าที่ต้องการแสดง
        </div>
      )}
    </div>
  );
}
