"use client";

// import { addDays, addHours, format, nextSaturday } from "date-fns";

import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
} from "lucide-react";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { formatDateTimePromotion } from "@/utils/formatDate";
import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";
import { PromotionCountdown } from "@/app/features/promotion/PromotionCountdown";
import { formatPrice } from "@/utils/formatPrice";

// interface Props {
//   product: Product | null;
// }

// export default function ProductDetailComponent({ product }: Props) {
export default function EventDetailComponent() {
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
              selectedPromotion.promotionActivities?.[0]
                .minimumPurchaseQuantity > 0 && (
                <div className="text-lg font-semibold">
                  จำนวนออเดอร์เป้าหมาย :{" "}
                  {
                    selectedPromotion.promotionActivities?.[0]
                      .minimumPurchaseQuantity
                  }
                </div>
              )}
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
              {/* <PromotionCountdown
                startTime={formatDateTimePromotion(selectedPromotion.startAt)}
                endTime={formatDateTimePromotion(selectedPromotion.endAt)}
              /> */}
            </div>
          </div>
          {/* </div> */}
          {/* end header */}

          <Separator />

          {/* product in event */}
          <div className="p-4 flex flex-col gap-2">
            <h1 className="font-bold text-lg mb-2">สินค้าในกิจกรรม</h1>
            {selectedPromotion.promotionActivities?.map((item) => (
              <div key={item.id}>
                <h1>{item.product?.sku}</h1>
                <h1>{item.product?.name}</h1>
                <p className="text-sm my-2">{item.product?.description}</p>
                <div className="grid grid-cols-[30%_1fr]">
                  {item.product?.image && (
                    <div className="relative w-full aspect-square">
                      <Image
                        fill
                        src={`${
                          process.env.NEXT_PUBLIC_IMAGE_HOST_URL +
                          item.product.image
                        }`}
                        alt={item.product.id}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  {selectedPromotion.type === "groupbuying" && (
                    <div className="p-4 text-lg">
                      <div>
                        ราคาขายตั้งต้น {formatPrice(item.product.price)}
                      </div>
                      <div>
                        <span>{"ส่วนลดเริ่มต้น " + item.discountAmount}</span>
                        <span>
                          {item.discountType === "fixed" ? " บาท" : " %"}
                        </span>
                      </div>
                      <div>
                        <span>
                          {"จำนวนส่วนลดสูงสุด " + item.discountGroupAmount}
                        </span>
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
                      {item.limitQuantityPerUser &&
                        item?.maxQuantityPerUser && (
                          <div>
                            {"จำกัดจำนวนไม่เกิน " +
                              item.maxQuantityPerUser +
                              " ชิ้นต่อคน"}
                          </div>
                        )}
                    </div>
                  )}
                  {selectedPromotion.type === "flashsale" && (
                    <div className="p-4 text-lg">
                      <div>
                        <span>{"ส่วนลด " + item.discountAmount}</span>
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
                      {item.limitQuantityPerUser && item.maxQuantityPerUser && (
                        <div>
                          {"จำกัดจำนวนไม่เกิน " +
                            item.maxQuantityPerUser +
                            " ชิ้นต่อคน"}
                        </div>
                      )}
                    </div>
                  )}
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
