import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <div className="fixed top-0 z-30 p-4 bg-primary w-full">
      <Link
        href="/"
        className="text-white flex gap-4 justify-start items-center"
      >
        <Image
          src={"/logo.jpeg"}
          alt=""
          width={80}
          height={80}
          priority
          className="rounded-sm"
        />
        <h1>RED OCEAN MARKETING</h1>
      </Link>
    </div>
  );
}
