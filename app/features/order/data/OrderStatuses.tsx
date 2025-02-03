import {
  CircleCheckBig,
  CircleX,
  HandCoins,
  LoaderCircle,
  Package,
  PackageCheck,
  RefreshCw,
} from "lucide-react";

export const statuses = [
  {
    value: "need_to_pay",
    label: "รอชำระเงิน",
    icon: RefreshCw,
  },
  {
    value: "pending",
    label: "อยู่ระหว่างดำเนินการ",
    icon: RefreshCw,
  },
  {
    value: "awaiting_confirmation",
    label: "รอยืนยันคำสั่งซื้อ",
    icon: LoaderCircle,
  },
  {
    value: "confirmed",
    label: "ยืนยันคำสั่งซื้อแล้ว",
    icon: CircleCheckBig,
  },
  {
    value: "preparing_to_ship",
    label: "เตรียมจัดส่ง",
    icon: Package,
  },
  // {
  //   value: "shipping",
  //   label: "กำลังจัดส่ง",
  //   icon: Truck,
  // },
  {
    value: "completed",
    label: "สำเร็จ",
    icon: PackageCheck,
  },
  {
    value: "refunded",
    label: "คืนเงิน",
    icon: HandCoins,
  },
  {
    value: "cancelled",
    label: "ยกเลิกคำสั่งซื้อ",
    icon: CircleX,
  },
  {
    value: "cancelled_and_refunded",
    label: "ยกเลิกคำสั่งซื้อและคืนเงิน",
    icon: CircleX,
  },
];
