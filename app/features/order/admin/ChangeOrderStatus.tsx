import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminOrderStore } from "@/state-stores/admin/adminOrderStore";
import { MoreVertical } from "lucide-react";
import React from "react";

type Props = {
  statuses: string[];
  id: string;
};

export default function ChangeOrderStatus({ statuses, id }: Props) {
  const changeOrderStatus = useAdminOrderStore(
    (state) => state.changeOrderStatus
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="focus-visible:ring-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statuses.map((status, idx) => (
          <DropdownMenuItem
            key={idx}
            onClick={() => changeOrderStatus(id, status)} // เรียกฟังก์ชันเมื่อคลิก
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
