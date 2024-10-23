import {
  Archive,
  CalendarClock,
  CircleCheckBig,
  CircleX,
  Flame,
  LucideIcon,
  PackageOpen,
  ShoppingBag,
  ShoppingCart,
  // TicketPercent,
  Truck,
} from "lucide-react";

interface Link {
  href: string;
  title: string;
  label?: string;
  icon: LucideIcon;
  variant: "default" | "default";
}

export const mainLinks: Link[] = [
  {
    href: "/admin",
    title: "คำสั่งซื้อ",
    label: "128",
    icon: ShoppingCart,
    variant: "default",
  },
  {
    href: "/admin/packing",
    title: "กำลังแพ็ค",
    label: "99",
    icon: PackageOpen,
    variant: "default",
  },
  {
    href: "/admin/shipping",
    title: "อยู่ระหว่างจัดส่ง",
    label: "9",
    icon: Truck,
    variant: "default",
  },

  {
    href: "/admin/delivered",
    title: "จัดส่งสำเร็จ",
    label: "23",
    icon: CircleCheckBig,
    variant: "default",
  },
  {
    href: "/admin/return-request",
    title: "ขอคืนสินค้า",
    label: "22",
    icon: Archive,
    variant: "default",
  },
  {
    href: "/admin/cancel",
    title: "ยกเลิกคำสั่งซื้อ",
    label: "34",
    icon: CircleX,
    variant: "default",
  },
];

export const secondLinks: Link[] = [
  {
    href: "/admin/product",
    title: "สินค้า",
    label: "972",
    icon: ShoppingBag,
    variant: "default",
  },
  {
    href: "/admin/hot-deal",
    title: "Hot Deal",
    label: "128",
    icon: Flame,
    variant: "default",
  },
  {
    href: "/admin/event",
    title: "จัดการอีเวนท์",
    label: "342",
    icon: CalendarClock,
    variant: "default",
  },
  // {
  //   href: "/admin/promotion",
  //   title: "โปรโมชั่น",
  //   label: "21",
  //   icon: TicketPercent,
  //   variant: "default",
  // },
];
