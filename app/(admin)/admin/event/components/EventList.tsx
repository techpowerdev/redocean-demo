"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import ToggleBooleanField from "./ToggleBooleanField";
import { CalendarClock } from "lucide-react";
import Loading from "@/components/shared/Loading";
import { PromotionType } from "@/types/fetchTypes";
import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";

type Props = {
  events: PromotionType[];
};
export function EventList({ events }: Props) {
  // global state
  const selectedPromotion = usePromotionStore(
    (state) => state.selectedPromotion
  );
  const selectPromotion = usePromotionStore((state) => state.selectPromotion);
  console.log(events);
  if (events.length === 0) {
    return (
      <div className="w-full flex justify-center items-center">
        ยังไม่มีกิจกกรม
      </div>
    );
  }
  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {events?.length ? (
          events?.map((item: PromotionType) => (
            <div
              key={item.id}
              className={cn(
                "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm cursor-pointer transition-all hover:bg-accent",
                selectedPromotion?.id === item.id && "bg-muted"
              )}
            >
              <div
                className="flex w-full flex-col gap-1"
                onClick={() => selectPromotion(item)}
              >
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">
                      ชื่อกิจกรรม : {item.name}
                    </div>
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
                    {formatDistanceToNow(new Date(item.startAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-[1fr_20%] gap-2">
                  <div>
                    <h1>รายละเอียดกิจกรรม :</h1>
                    <div className="line-clamp-2 text-xs text-muted-foreground">
                      {item.description.substring(0, 200)}
                    </div>
                  </div>
                  {/* {item.image && (
                    <div className="relative w-full aspect-square">
                      <Image
                        fill
                        src={`${
                          process.env.NEXT_PUBLIC_IMAGE_HOST_URL +
                          item.images[0].url
                        }`}
                        alt={item.images[0].id}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )} */}
                </div>
              </div>
              <ToggleBooleanField
                initialStatus={item.isActive}
                fieldName="isActive"
                icon={CalendarClock}
                apiEndpoint={`${process.env.NEXT_PUBLIC_API_URL}/promotions/${item.id}/toggle-active`} // ปรับ Endpoint ให้ตรงกับสินค้า
                id={item.id} // ส่งค่า ID ที่ถูกต้อง
                label="Active"
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
