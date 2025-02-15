import "../globals.css";
import type { Metadata } from "next";

import { AdminLayout } from "@/app/(admin)/admin/components/shared/AdminLayout";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import localFont from "next/font/local";
import CheckPermission from "@/app/features/auth/CheckPermission";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "RED OCEAN MARKETING",
  description: "eCommerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ดึงค่าจาก cookies
  const layout = cookies().get("redocean-resizable-panels:layout:admin");
  const collapsed = cookies().get("redocean-resizable-panels:collapsed");

  // นำค่าที่ได้จาก cookies มากำหนดค่าเป็น props สำหรับ resizable
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-scroll`}
      >
        <Toaster
        // toastOptions={{
        //   style: {
        //     background: "rgb(51 65 85",
        //     color: "#fff",
        //   },
        // }}
        />
        <CheckPermission />
        <AdminLayout
          defaultLayout={defaultLayout} // กำหนดความกว้างเริ่มต้น
          defaultCollapsed={defaultCollapsed} // กำหนดการหุบ ขยาย
          navCollapsedSize={4} // กำหนดขนาดต่ำสุดหลังหุบ
        >
          {children}
        </AdminLayout>
      </body>
    </html>
  );
}
