"use client";

// import { addDays, addHours, format, nextSaturday } from "date-fns";

import { Separator } from "@/components/ui/separator";

import { useProductStore } from "@/state-stores/admin/adminProductStore";
import Image from "next/image";
import { ProductVariantActionToolbar } from "./ProductVariantActionToolbar";
import { formatPrice } from "@/utils/formatPrice";
import AddVariantOptions from "./forms/AddVariantOptions";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToggleBooleanField from "./forms/ToggleBooleanField";
import { ListPlus } from "lucide-react";

// interface Props {
//   product: Product | null;
// }

// export default function ProductDetailComponent({ product }: Props) {
export default function ProductDetailComponent() {
  const selectedProduct = useProductStore((state) => state.selectedProduct);

  return (
    <div className="h-full flex-1 flex flex-col justify-stretch">
      {selectedProduct ? (
        <div className="flex flex-col flex-1 ">
          <div className="grid grid-cols-[15%_1fr] gap-4 p-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="relative w-full aspect-square">
                <Image
                  fill
                  src={
                    selectedProduct?.image
                      ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedProduct.image}`
                      : selectedProduct?.productVariants?.[0]?.image
                      ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${selectedProduct.productVariants[0].image}`
                      : "/no-image.png" // A fallback image path
                  }
                  alt={selectedProduct?.name || "Product image"}
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
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
              <div>
                <span className="font-semibold">ราคา : </span>
                {formatPrice(selectedProduct.price)}
              </div>
              <div>
                <span className="font-semibold"> จำนวนคงเหลือ : </span>
                <span className="text-primary">{selectedProduct.stock}</span>
              </div>

              {/* {selectedProduct.inStock ? (
                <div className="font-semibold">มีสินค้าพร้อมส่ง</div>
              ) : (
                <div className="text-end font-semibold">สินค้าหมด</div>
              )} */}
            </div>
          </div>
          {/* end header */}
          <div className="flex justify-end items-center mx-2 p-2">
            <ToggleBooleanField
              initialStatus={selectedProduct.hasVariant}
              fieldName="hasVariant"
              icon={ListPlus}
              apiEndpoint={`${process.env.NEXT_PUBLIC_API_URL}/products/change-hasvariant-status/${selectedProduct.id}`} // ปรับ Endpoint ให้ตรงกับสินค้า
              id={selectedProduct.id} // ส่งค่า ID ที่ถูกต้อง
              label="ตั้งค่าชนิดสินค้า"
            />
          </div>
          <Separator />
          {selectedProduct.hasVariant && (
            <div className="px-4 py-2">
              <div className="flex justify-between items-center gap-2 ">
                <div className="text-xl font-bold">ตัวเลือกสินค้า</div>
                {/* <AddProductVariant /> */}

                <AddVariantOptions />
              </div>

              <ScrollArea className="h-[450px] ">
                {/* product variants */}
                {selectedProduct.productVariants?.map((variant) => (
                  <div key={variant.id} className="my-2 border rounded-sm">
                    <div className="grid grid-cols-[12%_1fr] items-center gap-2 p-2">
                      <div className="relative w-full aspect-square">
                        <Image
                          fill
                          src={
                            variant?.image
                              ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${variant.image}`
                              : variant.product?.image
                              ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${variant.product?.image}`
                              : "/no-image.png" // A fallback image path
                          }
                          alt={variant?.sku || "Variant image"}
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-col items-start gap-2">
                        <div>
                          <span className="font-semibold">รหัสสินค้า : </span>
                          {variant.sku}
                        </div>
                        {variant.variantOptions && (
                          <div>
                            <span className="font-semibold">ตัวเลือก : </span>
                            {JSON.stringify(variant.variantOptions)}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold">ราคา : </span>
                          {formatPrice(variant.price)}
                        </div>
                        <div>
                          <span className="font-semibold">
                            {" "}
                            จำนวนคงเหลือ :{" "}
                          </span>
                          <span className="text-primary">{variant.stock}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <ProductVariantActionToolbar productVariant={variant} />
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
