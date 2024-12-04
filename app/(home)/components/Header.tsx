"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    // <div className="fixed top-0 z-30 p-4 flex justify-start items-center bg-primary w-full max-h-14">
    <div className="p-4 flex justify-start items-center bg-primary w-full max-h-14">
      <Link
        href="/"
        className="text-white flex gap-4 justify-start items-center"
      >
        <div className="w-12 h-12">
          <Image
            priority
            src="/logo.jpg"
            alt="logo"
            sizes="100vw"
            style={{
              width: "100%",
              height: "auto",
            }}
            width={256}
            height={256}
          />
        </div>
        <h1>RED OCEAN MARKETING</h1>
      </Link>
    </div>
  );
}
