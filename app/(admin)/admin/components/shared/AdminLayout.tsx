"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminNavbar } from "@/app/(admin)/admin/components/shared/AdminNavbar";
// import { AccountSwitcher } from "./AccoutSwitch";
// import { mainLinks, secondLinks } from "../../data/navlink";
// import { useProductStore } from "@/state-stores/admin/adminProductStore";
import {
  // Archive,
  CalendarClock,
  // CircleCheckBig,
  // CircleX,
  Flame,
  GalleryVertical,
  Images,
  // LayoutDashboard,
  LucideIcon,
  // PackageOpen,
  ShoppingBag,
  ShoppingCart,
  // TicketPercent,
  // Truck,
} from "lucide-react";
// import Image from "next/image";

// import { mainLinks, secondLinks } from "../data/navlink";

interface Props {
  children: React.ReactNode;
  defaultLayout: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export const accounts = [
  {
    // label: "Alicia Koch",
    email: "alicia@example.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Vercel</title>
        <path d="M24 22.525H0l12-21.05 12 21.05z" fill="currentColor" />
      </svg>
    ),
  },
  {
    // label: "Alicia Koch",
    email: "alicia@gmail.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>Gmail</title>
        <path
          d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    // label: "Alicia Koch",
    email: "alicia@me.com",
    icon: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <title>iCloud</title>
        <path
          d="M13.762 4.29a6.51 6.51 0 0 0-5.669 3.332 3.571 3.571 0 0 0-1.558-.36 3.571 3.571 0 0 0-3.516 3A4.918 4.918 0 0 0 0 14.796a4.918 4.918 0 0 0 4.92 4.914 4.93 4.93 0 0 0 .617-.045h14.42c2.305-.272 4.041-2.258 4.043-4.589v-.009a4.594 4.594 0 0 0-3.727-4.508 6.51 6.51 0 0 0-6.511-6.27z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

interface Link {
  href: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "default";
}

export function AdminLayout({
  children,
  defaultLayout = [20, 80], // [ขนาด side bar,ขนาด main content]
  defaultCollapsed = false,
  navCollapsedSize,
}: Props) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  //
  // const productLists = useProductStore((state) => state.productLists);

  const mainLinks: Link[] = [
    {
      href: "/admin",
      title: "Hot Deal",
      // label: "128",
      icon: Flame,
      variant: "default",
    },
    {
      href: "/admin/orders",
      title: "คำสั่งซื้อ",
      // label: "128",
      icon: ShoppingCart,
      variant: "default",
    },
    // {
    //   href: "/admin/packing",
    //   title: "กำลังแพ็ค",
    //   label: "99",
    //   icon: PackageOpen,
    //   variant: "default",
    // },
    // {
    //   href: "/admin/shipping",
    //   title: "อยู่ระหว่างจัดส่ง",
    //   label: "9",
    //   icon: Truck,
    //   variant: "default",
    // },

    // {
    //   href: "/admin/delivered",
    //   title: "จัดส่งสำเร็จ",
    //   label: "23",
    //   icon: CircleCheckBig,
    //   variant: "default",
    // },
    // {
    //   href: "/admin/return-request",
    //   title: "ขอคืนสินค้า",
    //   label: "22",
    //   icon: Archive,
    //   variant: "default",
    // },
    // {
    //   href: "/admin/cancel",
    //   title: "ยกเลิกคำสั่งซื้อ",
    //   label: "34",
    //   icon: CircleX,
    //   variant: "default",
    // },
  ];

  const secondLinks: Link[] = [
    {
      href: "/admin/product",
      title: "สินค้า",
      // label: `${productLists ? productLists.length : 0}`,
      icon: ShoppingBag,
      variant: "default",
    },

    {
      href: "/admin/promotion",
      title: "จัดการอีเวนท์",
      // label: "342",
      icon: CalendarClock,
      variant: "default",
    },
    {
      href: "/admin/banner",
      title: " แบนเนอร์",
      // label: "128",
      icon: GalleryVertical,
      variant: "default",
    },
    {
      href: "/admin/media/image",
      title: "คลังรูปภาพ",
      // label: "128",
      icon: Images,
      variant: "default",
    },
  ];
  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal" // แบ่ง layout โดยจัดเรียงไปตามแนวนอน
        onLayout={(sizes: number[]) => {
          // console.log(sizes);
          // เก็บค่า config ลง cookie เพื่อให้เมื่อเปิดกลับมายังคงจำ layout แบบเดิมไว้ได้
          document.cookie = `redocean-resizable-panels:layout:admin=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full min-h-screen"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize} // ขนาดหลังหุบ
          collapsible={true}
          minSize={15} // ขนาดเล็กสุดที่ย่อลงไปถึงได้
          maxSize={20} // ขนาดใหญ่สุดที่ขยายไปถึงได้
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `redocean-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          onResize={() => {
            setIsCollapsed(false);
            document.cookie = `redocean-resizable-panels:collapsed=${JSON.stringify(
              false
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            <h1
              className={cn(
                "text-primary font-semibold",
                isCollapsed ? "px-2 line-clamp-1" : "line-clamp-none"
              )}
            >
              RED OCEAN MARKETING
            </h1>
          </div>
          <Separator />
          <AdminNavbar isCollapsed={isCollapsed} links={mainLinks} />
          <Separator />
          <AdminNavbar isCollapsed={isCollapsed} links={secondLinks} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          // className="p-4"
          defaultSize={defaultLayout[1]}
          minSize={30}
        >
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}
