"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CategorySchema } from "@/zod-schemas/categorySchema";
import { createCategory } from "@/services/categoryServices";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export function CreateCategoryForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof CategorySchema>) {
    try {
      await createCategory(data);
      toast.success("เพิ่มหมวดหมู่สำเร็จ");
      form.reset();
      router.push("/admin/category");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("เกิดข้อผิดพลาดบางอย่าง");
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ชื่อหมวดหมู่สินค้า</FormLabel>
              <FormControl>
                <Input placeholder="เครื่องดื่ม" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button className="w-full md:w-fit" type="submit">
            บันทึก
          </Button>
        </div>
      </form>
    </Form>
  );
}
