"use client";
import { useCartServerStore } from "@/state-stores/cartServerStore";
import {
  CalendarCheck2,
  FileClock,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function MobileMenu() {
  const pathname = usePathname();

  // global state
  const cart = useCartServerStore((state) => state.cart);
  return (
    // <footer className="fixed z-30 bottom-0 bg-white border-t p-2 w-full flex gap-6 flex-wrap items-center justify-center">
    <footer className="bg-white border-t p-2 w-full flex gap-6 flex-wrap items-center justify-center">
      <Link
        className={`p-2 flex flex-col text-sm items-center gap-2 hover:bg-primary-foreground hover:rounded-lg ${
          pathname === "/" ? "bg-primary-foreground rounded-lg" : ""
        }`}
        href="/"
        rel="noopener noreferrer"
      >
        <CalendarCheck2 />
        กิจกรรม
      </Link>
      <Link
        className={`relative p-2 flex flex-col text-sm items-center gap-2 hover:bg-primary-foreground hover:rounded-lg ${
          pathname === "/cart" ? "bg-primary-foreground rounded-lg" : ""
        }`}
        href="/cart"
        rel="noopener noreferrer"
      >
        <span className="absolute -top-1 right-0 rounded-full bg-primary w-6 h-6 flex justify-center items-center text-white text-[12px]">
          {cart?.cartTotalQuantity}
        </span>
        <ShoppingCart />
        ตะกร้า
      </Link>
      <Link
        className={`p-2 flex flex-col text-sm items-center gap-2 hover:bg-primary-foreground hover:rounded-lg ${
          pathname === "/orders" ? "bg-primary-foreground rounded-lg" : ""
        }`}
        href="/orders"
        rel="noopener noreferrer"
      >
        <FileClock />
        การสั่งซื้อ
      </Link>
      <Link
        className={`p-2 flex flex-col text-sm items-center gap-2 hover:bg-primary-foreground hover:rounded-lg ${
          pathname === "/profile" ? "bg-primary-foreground rounded-lg" : ""
        }`}
        href="/profile"
        rel="noopener noreferrer"
      >
        <UserRound />
        โปรไฟล์
      </Link>
    </footer>
  );
}
