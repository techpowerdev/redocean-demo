import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";

// Form valiation lib
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import React from "react";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);

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
    } catch (error) {
      console.log(error);
      toast.error("บันทึกไม่สำเร็จ");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Edit size={16} />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm ">
          <DrawerHeader>
            <DrawerTitle>แก้ไขข้อมูลส่วนตัว</DrawerTitle>
            <DrawerDescription>กรอกข้อมูลส่วนตัวให้ครบถ้วน</DrawerDescription>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4 p-4"
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
        </div>
      </DrawerContent>
    </Drawer>
  );
}
