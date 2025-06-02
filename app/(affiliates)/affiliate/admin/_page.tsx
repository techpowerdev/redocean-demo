"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Check,
  DollarSign,
  Download,
  Menu,
  Package,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const approveAffiliate = (name: string) => {
    toast({
      title: "Affiliate อนุมัติแล้ว",
      description: `${name} ได้รับการอนุมัติเป็น Affiliate แล้ว`,
    });
  };

  const rejectAffiliate = (name: string) => {
    toast({
      title: "Affiliate ถูกปฏิเสธ",
      description: `${name} ถูกปฏิเสธการเป็น Affiliate`,
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
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
                    href="/affiliate/admin"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <Image
                      src="/abstract-geometric-logo.png"
                      alt="Affiliate Logo"
                      width={24}
                      height={24}
                      className="rounded"
                    />
                    <span>AffiliateHub Admin</span>
                  </Link>
                  <Link
                    href="/affiliate/admin"
                    className={`flex items-center gap-2 ${
                      activeTab === "overview"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("overview")}
                  >
                    <BarChart3 className="h-5 w-5" />
                    ภาพรวม
                  </Link>
                  <Link
                    href="/affiliate/admin?tab=affiliates"
                    className={`flex items-center gap-2 ${
                      activeTab === "affiliates"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("affiliates")}
                  >
                    <Users className="h-5 w-5" />
                    Affiliates
                  </Link>
                  <Link
                    href="/affiliate/admin?tab=products"
                    className={`flex items-center gap-2 ${
                      activeTab === "products"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("products")}
                  >
                    <Package className="h-5 w-5" />
                    สินค้า
                  </Link>
                  <Link
                    href="/affiliate/admin?tab=commissions"
                    className={`flex items-center gap-2 ${
                      activeTab === "commissions"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("commissions")}
                  >
                    <DollarSign className="h-5 w-5" />
                    ค่าคอมมิชชั่น
                  </Link>
                  <Link
                    href="/affiliate/admin?tab=settings"
                    className={`flex items-center gap-2 ${
                      activeTab === "settings"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-5 w-5" />
                    ตั้งค่า
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link
              href="/affiliate/admin"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Image
                src="/logo.jpg"
                alt="Khumkha Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="hidden md:inline">
                Khumkha Affiliate | Admin
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src="/placeholder-admin.jpg" alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <div className="text-sm font-medium">Admin</div>
              <div className="text-xs text-muted-foreground">
                admin@example.com
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <nav className="grid gap-6 p-6 text-sm font-medium">
            <Link
              href="/affiliate/admin"
              className={`flex items-center gap-2 ${
                activeTab === "overview"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="h-5 w-5" />
              ภาพรวม
            </Link>
            <Link
              href="/affiliate/admin?tab=affiliates"
              className={`flex items-center gap-2 ${
                activeTab === "affiliates"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("affiliates")}
            >
              <Users className="h-5 w-5" />
              Affiliates
            </Link>
            <Link
              href="/affiliate/admin?tab=products"
              className={`flex items-center gap-2 ${
                activeTab === "products"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("products")}
            >
              <Package className="h-5 w-5" />
              สินค้า
            </Link>
            <Link
              href="/affiliate/admin?tab=commissions"
              className={`flex items-center gap-2 ${
                activeTab === "commissions"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("commissions")}
            >
              <DollarSign className="h-5 w-5" />
              ค่าคอมมิชชั่น
            </Link>
            <Link
              href="/affiliate/admin?tab=settings"
              className={`flex items-center gap-2 ${
                activeTab === "settings"
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="h-5 w-5" />
              ตั้งค่า
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="md:hidden">
              <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
              <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="products">สินค้า</TabsTrigger>
              <TabsTrigger value="commissions">ค่าคอมมิชชั่น</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">ภาพรวมระบบ Affiliate</h1>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  ดาวน์โหลดรายงาน
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Affiliates ทั้งหมด
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1,248</div>
                    <p className="text-xs text-muted-foreground">
                      +24 ในเดือนนี้
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      ยอดขายทั้งหมด
                    </CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12,456</div>
                    <p className="text-xs text-muted-foreground">
                      +18.3% จากเดือนที่แล้ว
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      รายได้ทั้งหมด
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">฿4,562,890</div>
                    <p className="text-xs text-muted-foreground">
                      +15.6% จากเดือนที่แล้ว
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      ค่าคอมมิชชั่นที่จ่าย
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">฿456,289</div>
                    <p className="text-xs text-muted-foreground">
                      +12.4% จากเดือนที่แล้ว
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>ประสิทธิภาพรายเดือน</CardTitle>
                    <CardDescription>
                      แนวโน้มยอดขายและค่าคอมมิชชั่นในช่วง 12 เดือน
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 w-full bg-muted/20 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">
                        กราฟแสดงประสิทธิภาพรายเดือน
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Affiliate ยอดเยี่ยม</CardTitle>
                    <CardDescription>
                      Affiliate ที่มีผลงานดีที่สุดในเดือนนี้
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="Sofia Davis"
                          />
                          <AvatarFallback>SD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Sofia Davis</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>156 ยอดขาย | 4,532 คลิก</span>
                          </div>
                        </div>
                        <div className="font-medium">฿12,450</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="Alex Johnson"
                          />
                          <AvatarFallback>AJ</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Alex Johnson</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>132 ยอดขาย | 3,890 คลิก</span>
                          </div>
                        </div>
                        <div className="font-medium">฿10,320</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src="/placeholder-user.jpg"
                            alt="Maria Gonzalez"
                          />
                          <AvatarFallback>MG</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">Maria Gonzalez</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>104 ยอดขาย | 3,120 คลิก</span>
                          </div>
                        </div>
                        <div className="font-medium">฿8,760</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="affiliates" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">จัดการ Affiliates</h1>
                <div className="flex items-center gap-2">
                  <Input placeholder="ค้นหา Affiliate..." className="w-64" />
                  <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" />
                    ค้นหา
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>คำขอเป็น Affiliate ใหม่</CardTitle>
                  <CardDescription>
                    รายการคำขอเป็น Affiliate ที่รอการอนุมัติ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src="/placeholder-user.jpg"
                              alt="John Smith"
                            />
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">John Smith</h3>
                            <p className="text-sm text-muted-foreground">
                              john.smith@example.com
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          สมัครเมื่อ 2 วันที่แล้ว
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approveAffiliate("John Smith")}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            อนุมัติ
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectAffiliate("John Smith")}
                          >
                            <X className="mr-2 h-4 w-4" />
                            ปฏิเสธ
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src="/placeholder-user.jpg"
                              alt="Emily Wong"
                            />
                            <AvatarFallback>EW</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Emily Wong</h3>
                            <p className="text-sm text-muted-foreground">
                              emily.wong@example.com
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          สมัครเมื่อ 3 วันที่แล้ว
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => approveAffiliate("Emily Wong")}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            อนุมัติ
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => rejectAffiliate("Emily Wong")}
                          >
                            <X className="mr-2 h-4 w-4" />
                            ปฏิเสธ
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Affiliates ที่ใช้งานอยู่</CardTitle>
                  <CardDescription>
                    รายการ Affiliates ทั้งหมดในระบบ
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src="/placeholder-user.jpg"
                              alt="Sofia Davis"
                            />
                            <AvatarFallback>SD</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Sofia Davis</h3>
                            <p className="text-sm text-muted-foreground">
                              sofia.davis@example.com
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <div>ยอดขาย: 156</div>
                            <div>รายได้: ฿12,450</div>
                          </div>
                          <div className="text-sm">
                            <div>วันที่เข้าร่วม: 12 ม.ค. 2023</div>
                            <div>
                              สถานะ:{" "}
                              <span className="text-green-500">ใช้งาน</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src="/placeholder-user.jpg"
                              alt="Alex Johnson"
                            />
                            <AvatarFallback>AJ</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Alex Johnson</h3>
                            <p className="text-sm text-muted-foreground">
                              alex.johnson@example.com
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <div>ยอดขาย: 132</div>
                            <div>รายได้: ฿10,320</div>
                          </div>
                          <div className="text-sm">
                            <div>วันที่เข้าร่วม: 5 ก.พ. 2023</div>
                            <div>
                              สถานะ:{" "}
                              <span className="text-green-500">ใช้งาน</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src="/placeholder-user.jpg"
                              alt="Maria Gonzalez"
                            />
                            <AvatarFallback>MG</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">Maria Gonzalez</h3>
                            <p className="text-sm text-muted-foreground">
                              maria.gonzalez@example.com
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <div>ยอดขาย: 104</div>
                            <div>รายได้: ฿8,760</div>
                          </div>
                          <div className="text-sm">
                            <div>วันที่เข้าร่วม: 20 มี.ค. 2023</div>
                            <div>
                              สถานะ:{" "}
                              <span className="text-green-500">ใช้งาน</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="commissions" className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">จัดการค่าคอมมิชชั่น</h1>
                <Button>อัพเดทค่าคอมมิชชั่น</Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>โครงสร้างค่าคอมมิชชั่น</CardTitle>
                  <CardDescription>
                    กำหนดอัตราค่าคอมมิชชั่นตามหมวดหมู่สินค้า
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-medium">อิเล็กทรอนิกส์</h3>
                          <p className="text-sm text-muted-foreground">
                            สมาร์ทโฟน, แท็บเล็ต, คอมพิวเตอร์, ฯลฯ
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <div>อัตราปัจจุบัน: 5-10%</div>
                            <div>อัตราพิเศษ: 12% (โปรโมชั่น)</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          แก้ไข
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-medium">แฟชั่น</h3>
                          <p className="text-sm text-muted-foreground">
                            เสื้อผ้า, รองเท้า, กระเป๋า, ฯลฯ
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <div>อัตราปัจจุบัน: 10-15%</div>
                            <div>อัตราพิเศษ: 18% (โปรโมชั่น)</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          แก้ไข
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-medium">ความงามและสุขภาพ</h3>
                          <p className="text-sm text-muted-foreground">
                            เครื่องสำอาง, ผลิตภัณฑ์ดูแลผิว, อาหารเสริม, ฯลฯ
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <div>อัตราปัจจุบัน: 15-20%</div>
                            <div>อัตราพิเศษ: 25% (โปรโมชั่น)</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          แก้ไข
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>โปรโมชั่นพิเศษ</CardTitle>
                  <CardDescription>
                    โปรโมชั่นค่าคอมมิชชั่นพิเศษสำหรับช่วงเวลาจำกัด
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-medium">โปรโมชั่นวันหยุด</h3>
                          <p className="text-sm text-muted-foreground">
                            เพิ่มค่าคอมมิชชั่น 5% สำหรับทุกหมวดหมู่
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <div>วันที่เริ่ม: 1 ธ.ค. 2023</div>
                            <div>วันที่สิ้นสุด: 31 ธ.ค. 2023</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            แก้ไข
                          </Button>
                          <Button variant="outline" size="sm">
                            ลบ
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-medium">โปรโมชั่นวันแม่</h3>
                          <p className="text-sm text-muted-foreground">
                            เพิ่มค่าคอมมิชชั่น 8% สำหรับหมวดหมู่ความงามและสุขภาพ
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <div>วันที่เริ่ม: 1 ส.ค. 2023</div>
                            <div>วันที่สิ้นสุด: 15 ส.ค. 2023</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            แก้ไข
                          </Button>
                          <Button variant="outline" size="sm">
                            ลบ
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
