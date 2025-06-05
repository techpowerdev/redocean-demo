"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BarChart3, HandCoins, Link2, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AffiliateNavbar from "./AffiliateNavbar";
import { useEffect, useState } from "react";
import { getUserAffiliate } from "@/services/affiliateServices";
import { GetUserAffiliateResponse } from "@/types/affiliateTypes";

export default function AffiliateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const affiliateNavbar = [
    {
      href: "/affiliate/dashboard",
      title: "dashboard",
      label: "ภาพรวม",
      icon: BarChart3,
      variant: "default" as const,
    },
    {
      href: "/affiliate/links",
      title: "links",
      label: "ลิงก์ Affiliate",
      icon: Link2,
      variant: "default" as const,
    },
    {
      href: "/affiliate/earnings",
      title: "earnings",
      label: "รายได้",
      icon: HandCoins,
      variant: "default" as const,
    },
  ];

  const [userAffiliate, setUserAffiliate] = useState<
    GetUserAffiliateResponse["data"] | null
  >(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const myAffiliate = await getUserAffiliate();
        if (myAffiliate.data) {
          setUserAffiliate(myAffiliate.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetch();
  }, []);

  if (!userAffiliate) {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center gap-2">
        <span>ท่านยังไม่ได้สมัครใช้งานระบบ affiliate ของเรา</span>
        <Link
          className="text-white px-4 py-2 rounded-md bg-primary hover:bg-primary/85"
          href={"/affiliate/register"}
        >
          สมัครตอนนี้
        </Link>
      </div>
    );
  }

  if (userAffiliate?.status === "pending") {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <span>อยู่ระหว่างตรวจสอบ และรออนุมัติ</span>
        <span>ระหว่างนี้ท่านจะยังไม่สามารถใช้งานระบบ affiliate ได้</span>
        <Link
          className="text-white px-4 py-2 rounded-md bg-primary hover:bg-primary/85 my-2"
          href={"/"}
        >
          กลับไปหน้าหลัก
        </Link>
      </div>
    );
  }
  if (userAffiliate?.status === "rejected") {
    return (
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <span>คำขอสมัครเป็น Affiliate ของคุณถูกปฏิเสธ</span>
        <span>เนื่องจาก{userAffiliate.rejectReason}</span>
        <Link
          className="text-white px-4 py-2 rounded-md bg-primary hover:bg-primary/85 my-2"
          href={"/"}
        >
          กลับไปหน้าหลัก
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="w-full flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    href="/affiliate/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Image
                      src="/logo.jpg"
                      alt="Affiliate Logo"
                      width={40}
                      height={40}
                      className="rounded"
                    />
                    <span>Khumkha Affiliate</span>
                  </Link>
                  <AffiliateNavbar links={affiliateNavbar} />
                </nav>
              </SheetContent>
            </Sheet>
            <Link
              href="/affiliate/dashboard"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src="/logo.jpg"
                alt="Khumkha Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="hidden md:inline">Khumkha Affiliate</span>
            </Link>
          </div>
          {/* <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <div className="text-sm font-medium">Sofia Davis</div>
              <div className="text-xs text-muted-foreground">
                sofia@example.com
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">ออกจากระบบ</span>
            </Button>
          </div> */}
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-6 p-6 text-sm font-medium">
            <AffiliateNavbar links={affiliateNavbar} />
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
