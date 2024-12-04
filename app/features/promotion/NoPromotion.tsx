import EmptyState from "@/components/shared/EmptyState";
import { CalendarX2 } from "lucide-react";
import React from "react";

export default function NoPromotion() {
  return <EmptyState icon={CalendarX2} message="ยังไม่มีกิจกรรม" />;
}
