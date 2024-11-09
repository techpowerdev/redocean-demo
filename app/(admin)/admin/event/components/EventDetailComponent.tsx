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
import { useEventStore } from "@/state-stores/admin/adminEventStore";
import { formatDateTimeEvent } from "@/utils/formatDate";

// interface Props {
//   product: Product | null;
// }

// export default function ProductDetailComponent({ product }: Props) {
export default function EventDetailComponent() {
  const selectedEvent = useEventStore((state) => state.selectedEvent);

  return (
    <div className="h-full flex-1 flex flex-col justify-stretch">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!selectedEvent}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!selectedEvent}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!selectedEvent}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Tooltip>
            <Popover>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={!selectedEvent}>
                    <Clock className="h-4 w-4" />
                    <span className="sr-only">Snooze</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>
              <PopoverContent className="flex w-[535px] p-0">
                <div className="flex flex-col gap-2 border-r px-2 py-4">
                  <div className="px-4 text-sm font-medium">Snooze until</div>
                  <div className="grid min-w-[250px] gap-1">
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Later today{" "}
                      <span className="ml-auto text-muted-foreground">
                        {/* {format(addHours(today, 4), "E, h:m b")} */}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Tomorrow
                      <span className="ml-auto text-muted-foreground">
                        {/* {format(addDays(today, 1), "E, h:m b")} */}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      This weekend
                      <span className="ml-auto text-muted-foreground">
                        {/* {format(nextSaturday(today), "E, h:m b")} */}
                      </span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="justify-start font-normal"
                    >
                      Next week
                      <span className="ml-auto text-muted-foreground">
                        {/* {format(addDays(today, 7), "E, h:m b")} */}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="p-2">{/* <Calendar /> */}</div>
              </PopoverContent>
            </Popover>
            <TooltipContent>Snooze</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!selectedEvent}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!selectedEvent}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!selectedEvent}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!selectedEvent}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {selectedEvent ? (
        <div className="flex flex-col flex-1 ">
          <div className="grid grid-cols-[30%_1fr] gap-4 p-4">
            <div className="flex items-start gap-4 text-sm">
              {selectedEvent.images?.[0]?.url && (
                <div className="relative w-full aspect-square">
                  <Image
                    fill
                    src={`${
                      process.env.NEXT_PUBLIC_IMAGE_HOST_URL +
                      selectedEvent.images[0].url
                    }`}
                    alt={selectedEvent.images[0].id}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col items-start justify-between">
              <div className="font-semibold">{selectedEvent.title}</div>
              <div className="flex-1 my-2 whitespace-pre-wrap text-sm">
                {selectedEvent.description}
              </div>
              <div className="flex flex-col gap-2">
                <div className="line-clamp-1 text-xl font-bold">
                  วันเวลาเริ่มกิจกรรม :{" "}
                  {formatDateTimeEvent(selectedEvent.startTime)}
                </div>
                <div className="line-clamp-1 text-xl font-bold">
                  วันเวลาสิ้นสุดกิจกรรม :{" "}
                  {formatDateTimeEvent(selectedEvent.endTime)}
                </div>
              </div>
            </div>
          </div>
          {/* end header */}

          <Separator />

          {/* product in event */}
          <div className="p-4 flex flex-col gap-2">
            {selectedEvent.groupBuyEvent?.map((item) => (
              <div key={item.id}>
                <h1>{item.productName}</h1>
                <p className="text-sm my-2">{item.productDescription}</p>
                <div className="grid grid-cols-[30%_1fr]">
                  {item.productImages[0] && (
                    <div className="relative w-full aspect-square">
                      <Image
                        fill
                        src={`${
                          process.env.NEXT_PUBLIC_IMAGE_HOST_URL +
                          item.productImages[0]
                        }`}
                        alt={item.productImages[0]}
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4 text-lg">
                    <p>ราคาเริ่มต้น {item.productPrice} บาท</p>
                    <p>จำนวนออเดอร์เป้าหมาย {item.targetAmount} บาท</p>
                    <p>ราคาตามเป้าหมาย {item.finalPrice} ออเดอร์</p>
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
