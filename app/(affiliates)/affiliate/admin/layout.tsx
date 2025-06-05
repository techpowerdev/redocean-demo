"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BarChart3, Coins, HandCoins, Menu, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AffiliateNavbar from "../(infuencer)/AffiliateNavbar";

export default function AffiliateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const affiliateNavbar = [
    {
      href: "/affiliate/admin/dashboard",
      title: "dashboard",
      label: "ภาพรวม",
      icon: BarChart3,
      variant: "default" as const,
    },
    {
      href: "/affiliate/admin/affiliates",
      title: "affiliates",
      label: "Affiliates",
      icon: Users,
      variant: "default" as const,
    },
    {
      href: "/affiliate/admin/payout-reports",
      title: "payout-reports",
      label: "สรุปการจ่ายค่าคอมมิชชั่น",
      icon: HandCoins,
      variant: "default" as const,
    },
    {
      href: "/affiliate/admin/commission-policy",
      title: "commission-policy",
      label: "ตั้งค่านโยบายคอมมิชชั่น",
      icon: Coins,
      variant: "default" as const,
    },
  ];

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
