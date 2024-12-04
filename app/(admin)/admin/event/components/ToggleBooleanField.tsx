"use client";

import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import toast from "react-hot-toast";
import { LucideIcon } from "lucide-react";
import { useEventStore } from "@/state-stores/admin/adminEventStore";
import { usePromotionStore } from "@/state-stores/admin/adminPromotionStore";

interface ToggleBooleanFieldProps {
  initialStatus: boolean;
  id: string;
  apiEndpoint: string; // เส้นทาง API ที่ต้องการใช้
  fieldName: string; // ชื่อฟิลด์ที่ต้องการอัปเดตใน API
  label: string; // ข้อความ label ที่ต้องการแสดง
  icon?: LucideIcon; // ไอคอนที่ส่งเข้ามาเป็น prop
}

export default function ToggleBooleanField({
  initialStatus,
  id,
  apiEndpoint,
  fieldName,
  label,
  icon: Icon, // ทำการ destructure เป็น Icon เพื่อใช้เป็นคอมโพเนนต์
}: ToggleBooleanFieldProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const setPromotionLists = usePromotionStore(
    (state) => state.setPromotionLists
  );
  const promotionLists =
    usePromotionStore((state) => state.promotionLists) || [];

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const newStatus = !isActive;

      // ส่งคำร้องไปที่ API พร้อมกับ id และสถานะใหม่
      const response = await axios.patch(apiEndpoint, {
        id,
        [fieldName]: newStatus, // ใช้ fieldName เป็นกุญแจในการอัปเดต
      });
      console.log(response.data);

      if (response.status === 200) {
        // ถ้าอัปเดตสำเร็จ เปลี่ยนสถานะใน UI
        setIsActive(newStatus);

        const updated = promotionLists.map((item) =>
          item.id === id ? { ...item, [fieldName]: newStatus } : item
        );
        console.log(updated);
        setPromotionLists(updated);

        const notification = `${newStatus ? "เปิดกิจกรรม" : "ปิดกิจกรรม"}`;
        toast.success(notification);
      } else {
        throw new Error("อัปเดตไม่สำเร็จ");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1">
        {Icon && <Icon size={16} className="text-primary" />}
        {label}
      </span>
      <Switch
        checked={isActive}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
    </div>
  );
}
function usePromotionsStore(arg0: (state: any) => any) {
  throw new Error("Function not implemented.");
}
