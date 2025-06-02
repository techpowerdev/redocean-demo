// // components/date-range-picker.tsx
// "use client";

// import * as React from "react";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { DateRange } from "react-day-picker";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// export function DateRangePicker({
//   className,
// }: React.HTMLAttributes<HTMLDivElement>) {
//   const [date, setDate] = React.useState<DateRange | undefined>({
//     from: new Date(),
//     to: new Date(),
//   });

//   return (
//     <div className={cn("grid gap-2", className)}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={"outline"}
//             className={cn(
//               "w-[300px] justify-start text-left font-normal",
//               !date && "text-muted-foreground"
//             )}
//           >
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {date?.from ? (
//               date.to ? (
//                 <>
//                   {format(date.from, "dd-MM-yyyy")} ~{" "}
//                   {format(date.to, "dd-MM-yyyy")}
//                 </>
//               ) : (
//                 format(date.from, "dd-MM-yyyy")
//               )
//             ) : (
//               <span>เลือกวันที่</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             initialFocus
//             mode="range"
//             defaultMonth={date?.from}
//             selected={date}
//             onSelect={setDate}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }

//
"use client";

import * as React from "react";
import { format, subDays, subMonths } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = {
  value?: DateRange;
  onChange?: (value: DateRange | undefined) => void;
  className?: string;
};

export function DateRangePicker({ value, onChange, className }: Props) {
  const handleQuickSelect = (days: number) => {
    const now = new Date();
    const from = subDays(now, days - 1);
    const to = now;
    onChange?.({ from, to });
  };

  return (
    <div className={cn("flex gap-4", className)}>
      {/* JSON.stringify(value) สำหรับ debug */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full lg:w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd-MM-yyyy")} ~{" "}
                  {format(value.to, "dd-MM-yyyy")}
                </>
              ) : (
                format(value.from, "dd-MM-yyyy")
              )
            ) : (
              <span>เลือกวันที่</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 flex gap-2 flex-wrap"
          align="start"
        >
          <div className="flex flex-col gap-2 text-sm font-medium p-2">
            <span className="text-black/70">วันที่อัปเดตล่าสุด</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(7)}
              className="justify-start"
            >
              7 วันล่าสุด
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(15)}
              className="justify-start"
            >
              15 วันล่าสุด
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickSelect(30)}
              className="justify-start"
            >
              30 วันล่าสุด
            </Button>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            disabled={{
              before: subMonths(new Date(), 6),
              after: new Date(),
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
