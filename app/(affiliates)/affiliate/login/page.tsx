import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen py-12 px-4 md:px-6">
      <Link
        href="/affiliate"
        className="absolute top-8 left-8 flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        กลับไปหน้าหลัก
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={64}
            height={64}
            className="mx-auto rounded"
          />
          <h1 className="text-3xl font-bold mt-4">เข้าสู่ระบบ</h1>
          <p className="text-gray-500 mt-2">
            เข้าสู่ระบบเพื่อจัดการบัญชี Affiliate ของคุณ
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>เข้าสู่ระบบ</CardTitle>
            <CardDescription>กรอกข้อมูลเพื่อเข้าสู่ระบบ</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">รหัสผ่าน</Label>
                    <Link
                      href="/affiliate/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">
                  เข้าสู่ระบบ
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="text-center w-full text-sm">
              ยังไม่มีบัญชี?{" "}
              <Link
                href="/affiliate/register"
                className="text-primary hover:underline"
              >
                สมัครเป็น Affiliate
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
