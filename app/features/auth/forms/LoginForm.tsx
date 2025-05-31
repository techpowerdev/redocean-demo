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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/session";
import Image from "next/image";

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
      const response = await login(data);
      const { user, accessToken, refreshToken } = response.data;

      // @@@@@  Server action
      // save login session
      await createSession({
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });

      toast.success("เข้าสู่ระบบแล้ว");
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("เกิดข้อผิดพลาดที่บางอย่าง");
      }
    }
  }
  return (
    <>
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
                  เข้าสู่ระบบด้วยรหัสผ่าน
                </Button>
              </div>
              <div className="my-4 text-center text-sm">
                ยังไม่มีบัญชีผู้ใช้งาน? {""}
                <Link href="/register" className="underline">
                  ลงทะเบียน
                </Link>
              </div>

              {/* social login button */}
              <div className="flex flex-col gap-4 w-full max-w-xs mx-auto">
                {/* LINE Sign-In Button */}
                <a
                  href={"/login-line-liff"}
                  className="flex items-center justify-center gap-3 w-full py-2 px-4 rounded-md bg-[#00c300] hover:bg-[#00aa00] text-white font-medium shadow"
                >
                  <Image
                    src="/social-icons/line-icon.png"
                    alt="LINE Icon"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm">เข้าสู่ระบบด้วยบัญชี LINE</span>
                </a>

                {/* Google Sign-In Button */}
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google/login`}
                  className="flex items-center justify-center gap-3 w-full py-2 px-4 border border-gray-300 rounded-md bg-white hover:bg-gray-100 shadow"
                >
                  <Image
                    src="/social-icons/google-icon.png"
                    alt="Google Icon"
                    width={20}
                    height={20}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    เข้าสู่ระบบด้วยบัญชี Google
                  </span>
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
