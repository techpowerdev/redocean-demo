import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";
import Header from "@/components/shared/Header";
import MobileMenu from "@/components/shared/MobileMenu";
import { Toaster } from "react-hot-toast";
import CheckLogined from "../features/auth/CheckLogined";
import ResponsiveLayoutContainer from "@/components/shared/ResponsiveLayoutContainer";

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
  description: "เว็บซื้อขายสินค้า ราคาถูก",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <CheckLogined />

        <ResponsiveLayoutContainer className="font-[family-name:var(--font-geist-sans)]">
          {/* Header */}
          <Header />

          {/* Main content with scroll */}
          <main className="flex-1 overflow-y-auto p-2">{children}</main>

          {/* Footer */}
          <MobileMenu />
        </ResponsiveLayoutContainer>
      </body>
    </html>
  );
}
