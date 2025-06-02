import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();

  if (!session || !session.user)
    return NextResponse.redirect(new URL("/login", req.nextUrl));

  const role = session.user.role;

  const { pathname } = req.nextUrl;
  console.log("pathname:", pathname);

  const isAdminPage =
    pathname.startsWith("/admin") || pathname.startsWith("/affiliate/admin");

  // Check user role for /admin route
  if (isAdminPage) {
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  NextResponse.next();
}

export const config = {
  // ถ้าไม่มี session login เมื่ออยู่ใน path เหล่านี้จะถูก redirect ไป "/login"

  // กำหนดว่าจะให้ middleware ทำงานที่ path ไหนบ้าง (ต้องกำหนด ไม่งั้น middleware จะไม่ส่งผลใน path นั้นๆ)
  matcher: [
    "/cart",
    "/orders",
    "/order",
    "/profile/:path*", // ทั้งหมดที่ขึ้นต้นด้วย /profile
    "/verify-user",
    "/user/:path*",
    "/admin/:path*",
    "/affiliate/dashboard",
    "/affiliate/admin/:path*",
  ],
};
