"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { login } from "@/services/authServices";
import { LoginResponseType } from "@/types/userTypes";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .refine((val) => val === "" || z.string().email().safeParse(val).success, {
      message: "กรุณาระบุอีเมลให้ถูกต้อง",
    }),
  password: z
    .string()
    .min(6, { message: "รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร" })
    .refine(
      (val) =>
        /[A-Z]/.test(val) && // ต้องมีตัวอักษรพิมพ์ใหญ่
        /[a-z]/.test(val) && // ต้องมีตัวอักษรพิมพ์เล็ก
        /\d/.test(val) && // ต้องมีตัวเลข
        /[@$!%*?&]/.test(val), // ต้องมีอักขระพิเศษ
      {
        message:
          "รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่ ตัวอักษรพิมพ์เล็ก ตัวเลข และอักขระพิเศษ",
      }
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema), // validate data with the schema
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: FormValues) {
    try {
      const response: LoginResponseType = await login(data);
      console.log(response.data);
      toast.success(response.message || "เข้าสู่ระบบแล้ว");
      router.push("/admin");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("เกิดข้อผิดพลาดที่บางอย่าง");
      }
    }
  }
  return (
    <Card className="mx-auto min-w-80 max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>รหัสผ่าน</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="กรอกรหัสผ่าน"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                เข้าสู่ระบบ
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              ยังไม่มีบัญชีผู้ใช้งาน? {""}
              <Link href="/register" className="underline">
                ลงทะเบียน
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
