// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "../globals.css";
// import Header from "@/components/shared/Header";
// import MobileMenu from "@/components/shared/MobileMenu";
// import { Toaster } from "react-hot-toast";
// import CheckLogined from "../features/auth/CheckLogined";
// // import ResponsiveDivider from "@/components/shared/ResponsiveDivider";

// const geistSans = localFont({
//   src: "../fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "../fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "RED OCEAN MARKETING",
//   description: "เว็บซื้อขายสินค้า ราคาถูก",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         {/* <ResponsiveDivider /> */}
//         <Toaster
//         // toastOptions={{
//         //   style: {
//         //     background: "rgb(51 65 85",
//         //     color: "#fff",
//         //   },
//         // }}
//         />
//         <CheckLogined />
//         {/* <div className="flex flex-col h-screen font-[family-name:var(--font-geist-sans)]"> */}
//         <div className="flex flex-col h-[calc(100vh-86px)] font-[family-name:var(--font-geist-sans)]">
//           {/* Header */}
//           <Header />

//           {/* Main content with scroll */}
//           <main className="h-full w-full bg-red-600 overflow-y-auto p-2">
//             {children}
//           </main>
//           {/* <div className="">remove footer space</div> */}

//           {/* Footer */}
//           <MobileMenu />
//         </div>
//       </body>
//     </html>
//   );
// }

import type { Metadata } from "next";
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
        {/* <div
          className="flex flex-col font-[family-name:var(--font-geist-sans)]"
          style={{
            height: viewHeight ? `${viewHeight}px` : "100vh", // ใช้ viewHeight เพื่อคำนวณความสูง
          }}
        > */}
        <ResponsiveLayoutContainer className="font-[family-name:var(--font-geist-sans)]">
          {/* Header */}
          <Header />

          {/* Main content with scroll */}
          <main className="flex-1 overflow-y-auto p-2">{children}</main>

          {/* Footer */}
          <MobileMenu />
        </ResponsiveLayoutContainer>

        {/* </div> */}
      </body>
    </html>
  );
}
