"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import toast from "react-hot-toast";
import { LucideIcon } from "lucide-react";

interface ToggleBooleanFieldProps {
  initialStatus: boolean;
  id: string;
  changeStatus: (id: string, status: boolean) => Promise<void>;
  label: string; // ข้อความ label ที่ต้องการแสดง
  icon?: LucideIcon; // ไอคอนที่ส่งเข้ามาเป็น prop
}

export default function ChangeBooleanStatusField({
  initialStatus,
  id,
  changeStatus,
  label,
  icon: Icon, // ทำการ destructure เป็น Icon เพื่อใช้เป็นคอมโพเนนต์
}: ToggleBooleanFieldProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const newStatus = !isActive;

      await changeStatus(id, newStatus);
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsActive(initialStatus);
  }, [initialStatus]);

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
