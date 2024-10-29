"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

export default function Header() {
  return (
    <div className="fixed top-0 z-30 p-4 bg-primary w-full">
      <Link
        href="/"
        className="text-white flex gap-4 justify-start items-center"
      >
        <Image
          priority
          src={"/logo.jpeg"}
          alt="logo"
          style={{
            width: "80px",
            height: "auto",
          }}
          width={80}
          height={80}
          className="rounded-sm"
        />
        <h1>RED OCEAN MARKETING</h1>
      </Link>
    </div>
  );
}
