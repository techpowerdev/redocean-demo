"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEventStore } from "@/state-stores/admin/adminEventStore";

interface FormSwitcherProps {
  isCollapsed: boolean;
  forms: {
    label: string;
    event: string;
    icon: React.ReactNode;
  }[];
}

export function FormSwitcher({ isCollapsed, forms }: FormSwitcherProps) {
  // const [selectedForm, setSelectedForm] = React.useState<string>(
  //   forms[0].event
  // );
  const selectedEventForm = useEventStore((state) => state.selectedEventForm);
  const selectEventForm = useEventStore((state) => state.selectEventForm);

  return (
    <Select defaultValue={selectedEventForm} onValueChange={selectEventForm}>
      <SelectTrigger
        className={cn(
          "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
          isCollapsed &&
            "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden"
        )}
        aria-label="Select event"
      >
        <SelectValue placeholder="Select an event">
          {forms.find((form) => form.event === selectedEventForm)?.icon}
          <span className={cn("ml-2", isCollapsed && "hidden")}>
            {forms.find((form) => form.event === selectedEventForm)?.label}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {forms.map((form) => (
          <SelectItem key={form.event} value={form.event}>
            <div className="flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
              {/* {form.icon} */}
              {form.event}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}