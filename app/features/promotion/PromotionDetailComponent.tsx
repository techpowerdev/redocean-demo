"use client";

import { Separator } from "@/components/ui/separator";

import Image from "next/image";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";

export default function PromotionDetailComponent() {
  const selectedPromotion = usePromotionStore(
    (state) => state.selectedPromotion
  );

  return (
    <div className="h-full flex-1 flex flex-col justify-stretch">
      {selectedPromotion ? (
        <div className="flex flex-col flex-1 ">
          <div className="flex flex-col items-start justify-between p-4">
            <div className="text-lg font-semibold">
              ประเภทกิจกรรม : {selectedPromotion.type}
            </div>
            <div className="text-lg font-semibold">
              ชื่อกิจกรรม : {selectedPromotion.name}
            </div>
            {selectedPromotion.promotionActivities?.[0]
              .minimumPurchaseQuantity &&
            selectedPromotion.promotionActivities?.[0].minimumPurchaseQuantity >
              0 ? (
              <div className="text-lg font-semibold">
                จำนวนออเดอร์เป้าหมาย :{" "}
                {
                  selectedPromotion.promotionActivities?.[0]
                    .minimumPurchaseQuantity
                }
              </div>
            ) : null}
            <div className="flex-1 whitespace-pre-wrap my-6">
              รายละเอียด : {selectedPromotion.description}
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-xl">
                วันเวลาเริ่มกิจกรรม :{" "}
                {formatDateTimePromotion(
                  new Date(selectedPromotion.startAt).toISOString()
                )}
              </div>
              <div className="text-xl">
                วันเวลาสิ้นสุดกิจกรรม :{" "}
                {formatDateTimePromotion(
                  new Date(selectedPromotion.endAt).toISOString()
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* product in event */}
          <div className="p-4 flex flex-col gap-2">
            <h1 className="font-bold text-lg mb-2">สินค้าในกิจกรรม</h1>
            {selectedPromotion.promotionActivities?.map((item) => (
              <div key={item.id}>
                <h1>รหัสสินค้า: {item.product?.sku}</h1>
                <h1>ชื่อสินค้า : {item.product?.name}</h1>
                <p className="text-sm my-2">
                  รายละเอียด : {item.product?.description}
                </p>
                <div className="grid grid-cols-[30%_1fr]">
                  <div className="relative w-full aspect-square">
                    <Image
                      fill
                      src={
                        item.product?.image
                          ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${item.product.image}`
                          : item.product?.productVariants?.[0]?.image
                          ? `${process.env.NEXT_PUBLIC_IMAGE_HOST_URL}${item.product.productVariants[0].image}`
                          : "/no-image.png" // A fallback image path
                      }
                      alt={item.product?.id || ""}
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  <div className="p-4 text-lg">
                    <div className="font-semibold">รายละเอียดโปรโมชั่น :</div>
                    {/* <div>
                        ราคาขายตั้งต้น {formatPrice(item.product.price)}
                      </div> */}
                    <div>
                      <span>{"ส่วนลดเริ่มต้น " + item.discountAmount}</span>
                      <span>
                        {item.discountType === "fixed" ? " บาท" : " %"}
                      </span>
                    </div>
                    {item.limitQuantity && item.maxQuantity && (
                      <div>
                        {"สินค้ามีจำนวนจำกัดแค่ " +
                          item.maxQuantity +
                          " ชิ้นเท่านั้น"}
                      </div>
                    )}
                    {item.limitQuantityPerUser && item?.maxQuantityPerUser && (
                      <div>
                        {"จำกัดจำนวนไม่เกิน " +
                          item.maxQuantityPerUser +
                          " ชิ้นต่อคน"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          ยังไม่ได้เลือกกิจกรรมที่ต้องการแสดง
        </div>
      )}
    </div>
  );
}
