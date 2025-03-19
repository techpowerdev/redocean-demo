import React from "react";

import { MoreVertical } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product, ProductVariant, Promotion } from "@/types/baseTypes";

type ActionButton = {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: () => void;
  disabled?: boolean;
};

type Props = {
  selectedItem: Product | ProductVariant | Promotion | null;
  actions: ActionButton[];
  dropdownItems?: string[];
};
export default function ActionToolbar({
  selectedItem,
  actions,
  dropdownItems,
}: Props) {
  return (
    <div className="flex items-center">
      <div className="flex items-center gap-2">
        {actions.map((action, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={action.onClick}
                disabled={action.disabled || !selectedItem}
              >
                {action.icon}
                <span className="sr-only">{action.tooltip}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{action.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </div>
      {dropdownItems && (
        <>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!selectedItem}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {dropdownItems.map((item, idx) => (
                <DropdownMenuItem key={idx}>{item}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </div>
  );
}
