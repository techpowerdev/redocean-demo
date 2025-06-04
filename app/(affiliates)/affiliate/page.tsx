import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BarChart3, DollarSign, Gift, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/affiliate" className="flex items-center gap-2">
            <Image
              src="/logo.jpg"
              alt="Khumkha Logo"
              width={48}
              height={48}
              className="rounded"
            />
            <span className="hidden sm:text-xl font-bold">
              Khumkha Affiliate
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/affiliate#features"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              คุณสมบัติ
            </Link>
            <Link
              href="/affiliate#how-it-works"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              วิธีการทำงาน
            </Link>
            <Link
              href="/affiliate#commission"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              ค่าคอมมิชชั่น
            </Link>
            <Link
              href="/affiliate#faq"
              className="text-sm font-medium hover:underline underline-offset-4"
            >
              คำถามที่พบบ่อย
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/affiliate/dashboard">
              <Button variant="outline">เข้าสู่ระบบ</Button>
            </Link>
            <Link href="/affiliate/register">
              <Button>สมัครเป็น Affiliate</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    สร้างรายได้ด้วยระบบ Affiliate ของเรา
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    แนะนำสินค้าให้กับเพื่อน ครอบครัว หรือผู้ติดตามของคุณ
                    และรับค่าคอมมิชชั่นสูงสุดถึง 20% จากทุกการซื้อ
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <Link href="/affiliate/register">
                    <Button className="px-8">
                      เริ่มต้นตอนนี้
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/affiliate#how-it-works">
                    <Button variant="outline" className="px-8">
                      เรียนรู้เพิ่มเติม
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mr-0">
                <Image
                  src="/affiliate-dashboard-overview.png"
                  alt="Affiliate Dashboard"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  คุณสมบัติหลักของระบบ Affiliate
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  ระบบ Affiliate
                  ของเราได้รับการออกแบบมาเพื่อช่วยให้คุณสร้างรายได้ได้อย่างง่ายดายและมีประสิทธิภาพ
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <DollarSign className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">ค่าคอมมิชชั่นสูง</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  รับค่าคอมมิชชั่นสูงสุดถึง 20% จากทุกการซื้อผ่านลิงก์ของคุณ
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">การติดตามแบบเรียลไทม์</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  ติดตามคลิก การแปลงเป็นยอดขาย และรายได้ของคุณแบบเรียลไทม์
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">โปรแกรมแนะนำ</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  รับรายได้เพิ่มเติมเมื่อแนะนำ Affiliate รายใหม่เข้าสู่ระบบ
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">โปรโมชั่นพิเศษ</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  เข้าถึงโปรโมชั่นพิเศษและส่วนลดเฉพาะสำหรับ Affiliate
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  วิธีการทำงาน
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  เริ่มต้นสร้างรายได้กับระบบ Affiliate ของเราได้ง่ายๆ เพียง 4
                  ขั้นตอน
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mt-8">
              <div className="relative flex flex-col items-center space-y-2 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  1
                </div>
                <h3 className="text-xl font-bold">สมัครเป็น Affiliate</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  กรอกข้อมูลและสมัครเข้าร่วมโปรแกรม Affiliate ของเรา
                </p>
              </div>
              <div className="relative flex flex-col items-center space-y-2 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  2
                </div>
                <h3 className="text-xl font-bold">รับลิงก์ Affiliate</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  สร้างลิงก์ Affiliate สำหรับสินค้าที่คุณต้องการแนะนำ
                </p>
              </div>
              <div className="relative flex flex-col items-center space-y-2 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  3
                </div>
                <h3 className="text-xl font-bold">แชร์ลิงก์</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  แชร์ลิงก์ผ่านโซเชียลมีเดีย บล็อก หรือช่องทางอื่นๆ
                </p>
              </div>
              <div className="relative flex flex-col items-center space-y-2 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                  4
                </div>
                <h3 className="text-xl font-bold">รับค่าคอมมิชชั่น</h3>
                <p className="text-sm text-gray-500 text-center dark:text-gray-400">
                  รับค่าคอมมิชชั่นเมื่อมีการซื้อสินค้าผ่านลิงก์ของคุณ
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="commission" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  โครงสร้างค่าคอมมิชชั่น
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  เรามีโครงสร้างค่าคอมมิชชั่นที่แข่งขันได้และเป็นธรรมสำหรับ
                  Affiliate ทุกคน
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-8">
              <div className="rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-2xl font-bold">อัตราค่าคอมมิชชั่น</h3>
                  <div className="mt-4 grid gap-4">
                    <div className="grid grid-cols-2 items-center gap-4 border-b pb-4">
                      <div className="font-medium">หมวดหมู่สินค้า</div>
                      <div className="font-medium">อัตราค่าคอมมิชชั่น</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4 border-b pb-4">
                      <div>อิเล็กทรอนิกส์</div>
                      <div>5-10%</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4 border-b pb-4">
                      <div>แฟชั่น</div>
                      <div>10-15%</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4 border-b pb-4">
                      <div>ความงามและสุขภาพ</div>
                      <div>15-20%</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4 border-b pb-4">
                      <div>อาหารและเครื่องดื่ม</div>
                      <div>8-12%</div>
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                      <div>สินค้าอื่นๆ</div>
                      <div>5-15%</div>
                    </div>
                  </div>
                </div>
                <div className="border-t p-6 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                  <h4 className="font-semibold">โบนัสพิเศษ</h4>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    รับโบนัสเพิ่ม 5% เมื่อยอดขายรวมต่อเดือนมากกว่า 100,000 บาท
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  คำถามที่พบบ่อย
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  คำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับโปรแกรม Affiliate ของเรา
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-8 space-y-4">
              <div className="rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold">
                    ใครสามารถเข้าร่วมโปรแกรม Affiliate ได้บ้าง?
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    ทุกคนที่มีอายุ 18 ปีขึ้นไปสามารถสมัครเข้าร่วมโปรแกรม
                    Affiliate ของเราได้ ไม่ว่าจะเป็นบล็อกเกอร์ อินฟลูเอนเซอร์
                    หรือบุคคลทั่วไป
                  </p>
                </div>
              </div>
              <div className="rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold">
                    ฉันจะได้รับค่าคอมมิชชั่นเมื่อไหร่?
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    ค่าคอมมิชชั่นจะถูกจ่ายทุกวันที่ 15 ของเดือนถัดไป
                    หลังจากที่ยอดขายได้รับการยืนยันและผ่านช่วงเวลาคืนสินค้า (30
                    วัน)
                  </p>
                </div>
              </div>
              <div className="rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold">
                    มีขั้นต่ำในการถอนเงินหรือไม่?
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    ยอดขั้นต่ำในการถอนเงินคือ 500 บาท
                    หากยอดค่าคอมมิชชั่นของคุณต่ำกว่า 500 บาท
                    จะถูกสะสมไว้จนกว่าจะถึงยอดขั้นต่ำ
                  </p>
                </div>
              </div>
              <div className="rounded-lg border shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-semibold">
                    ฉันสามารถติดตามยอดขายและค่าคอมมิชชั่นได้อย่างไร?
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    คุณสามารถติดตามยอดขายและค่าคอมมิชชั่นได้แบบเรียลไทม์ผ่านแดชบอร์ด
                    Affiliate ของเรา ซึ่งมีรายงานและกราฟแสดงผลการดำเนินงานของคุณ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  พร้อมที่จะเริ่มต้นแล้วหรือยัง?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  สมัครเข้าร่วมโปรแกรม Affiliate
                  ของเราวันนี้และเริ่มต้นสร้างรายได้
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/affiliate/register">
                  <Button className="px-8">
                    สมัครเป็น Affiliate
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container mx-auto flex flex-col gap-4 py-10 md:flex-row md:gap-8 md:py-12 px-4 md:px-6">
          <div className="flex flex-col gap-2 md:gap-4">
            <Link href="/affiliate" className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="Khumkha Logo"
                width={48}
                height={48}
                className="rounded"
              />
              <span className="text-xl font-bold">Khumkha Affiliate</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ระบบ Affiliate
              ที่ช่วยให้คุณสร้างรายได้จากการแนะนำสินค้าที่คุณชื่นชอบ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
