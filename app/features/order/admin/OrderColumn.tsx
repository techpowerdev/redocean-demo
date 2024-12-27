"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// import { labels, priorities, statuses } from "./data/data";
// import { Task } from "./data/schema";
import {
  CircleCheckBig,
  RefreshCw,
  TicketPercent,
  Truck,
  Users,
} from "lucide-react";
// import { z } from "zod";
import { OrderType } from "@/types/fetchTypes";
import { formatPrice } from "@/utils/formatPrice";
import { DataTableColumnHeader } from "@/components/shared/table/DataTableColumnHeader";
import ChangeOrderStatus from "@/app/features/order/admin/ChangeOrderStatus";
// import { DataTableRowActions } from "../../components/shared/DataTableRowActions";

export const labels = [
  {
    value: "groupbuying",
    label: "รวมออเดอร์",
    icon: Users,
  },
  {
    value: "flashsale",
    label: "โปรโมชั่นลดราคา",
    icon: TicketPercent,
  },
];

// pending
// shipping
// return
// completed
// cancelled
// failed
// refunded

export const statuses = [
  {
    value: "pending",
    label: "Pending",
    icon: RefreshCw,
  },
  {
    value: "shipping",
    label: "Shipping",
    icon: Truck,
  },
  {
    value: "completed",
    label: "Completed",
    icon: CircleCheckBig,
  },
];

// export const orderSchema = z.object({
//   id: z.string(),
//   title: z.string(),
//   status: z.string(),
//   label: z.string(),
//   priority: z.string(),
// });

// export type Order = z.infer<typeof orderSchema>;
export type Order = OrderType;
// "id": "cm3fkkj8d000r22mlkoztebnj",
// "orderType": "groupbuying",
// "creditCardFee": 0,
// "shippingFee": 0,
// "totalAmount": 0,
// "returnAmount": 0,
// "status": "pending",
// "trackingNumber": "TH0988767373",
// "shippingAddress
// กำหนดหัวของคอลัมน์
export const OrderColumn: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    //row.getValue("id") => ดึงข้อมูลมาแสดงโดยเข้าถึงจาก key ใน json data ของเรา
    cell: ({ row }) => <div className="">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderType",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Type" />
    ),
    cell: ({ row }) => {
      const label = labels.find(
        (label) => label.value === row.original.orderType
      );

      return (
        <div className="flex space-x-2">
          {label && <Badge variant="outline">{label.label}</Badge>}
          {/* <span className="max-w-[500px] truncate font-medium">
            {row.getValue("orderType")}
          </span> */}
        </div>
      );
    },
  },
  {
    accessorKey: "totalAmount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total Amount" />
    ),
    cell: ({ row }) => (
      <div className="">{formatPrice(row.getValue("totalAmount"))}</div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      // ปรับแต่งลักษณะการแสดงข้อมูล โดย map จากค่าบางอย่าง เช่น status=>"pending"และแสดงอีกคนละสีไอคอน ต่างจากstatus=> success
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }

      // return ค่าหรือ jsx กลับไปแสดง
      return (
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center">
            {status.icon && (
              <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{status.label}</span>
          </div>
          <ChangeOrderStatus
            statuses={statuses.map((status) => status.value)}
            id={row.getValue("id")}
          />
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "trackingNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tracking No." />
    ),
    cell: ({ row }) => <div className="">{row.getValue("trackingNumber")}</div>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     );

  //     if (!priority) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];
