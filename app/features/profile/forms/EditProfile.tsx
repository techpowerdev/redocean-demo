"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

// Form valiation lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import React, { useState } from "react";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { editProfile } from "@/services/profileServices";
import toast from "react-hot-toast";

// zod schema
const formSchema = z.object({
  fullName: z
    .string()
    .optional()
    .refine(
      (val) => val === undefined || val.trim() === "" || val.trim().length > 0,
      {
        message: "กรุณากรอกชื่อ-สกุล",
      }
    ),
  phoneNumber: z
    .string({
      required_error: "กรุณาระบุเบอร์โทร", // ใช้ข้อความนี้เมื่อฟิลด์ว่าง
    })
    .nonempty({ message: "กรุณาระบุเบอร์โทร" }) // ตรวจสอบให้แน่ใจว่าฟิลด์ไม่ว่าง
    .regex(/^0[0-9]{9}$/, { message: "รูปแบบเบอร์โทรไม่ถูกต้อง" }), // ตรวจสอบรูปแบบเบอร์โทร
  email: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === "" ||
        z.string().email().safeParse(val).success,
      {
        message: "กรุณาระบุอีเมลที่ถูกต้อง",
      }
    ),
});

export type FormData = z.infer<typeof formSchema>;

export function EditProfile() {
  // global state
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);

  // local state
  const [isOpen, setIsOpen] = useState(false); // จัดการสถานะของ Sheet

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema), // validate data with the schema
    defaultValues: {
      fullName: currentUser?.fullName || undefined,
      phoneNumber: currentUser?.phoneNumber || undefined,
      email: currentUser?.email || undefined,
    },
  });

  // };

  const onSubmit = async (data: FormData) => {
    try {
      const response = await editProfile(data);
      setCurrentUser(response.data);
      toast.success("บันทึกสำเร็จ");
      setIsOpen(false); // ปิด Sheet เมื่อบันทึกสำเร็จ
    } catch (error) {
      if (error instanceof Error) {
        // ถ้าเกิดข้อผิดพลาดจากฟังก์ชัน editProfile
        console.error("Error:", error.message);
        // แสดงข้อความที่ return จาก API
        toast.error(error.message);
      }
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Edit size={16} onClick={() => setIsOpen(true)} />
      </SheetTrigger>
      <SheetContent className="w-full md:w-[540px]">
        <SheetHeader>
          <SheetTitle>แก้ไขข้อมูลส่วนตัว</SheetTitle>
          <SheetDescription>กรอกข้อมูลส่วนตัวให้ครบถ้วน</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 my-2"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ-สกุล</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกชื่อ-สกุล" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทร</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกเบอร์โทร" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input placeholder="กรอกอีเมล" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              บันทึกการแก้ไข
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
