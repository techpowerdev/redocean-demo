import Image from "next/image";
import Link from "next/link";
import React from "react";
import AuthButton from "@/app/features/auth/AuthButton";
import { DollarSign } from "lucide-react";

export default function Header() {
  return (
    <div className="w-full max-h-14 flex justify-between items-center bg-primary p-4">
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
        <h1 className="hidden sm:block">khumkha.com</h1>
      </Link>
      <div className="flex-grow flex gap-2 justify-end items-center">
        <Link
          href={"/affiliate"}
          target="_blank"
          className="flex justify-center items-center gap-1
       mr-6 rounded-lg p-2 bg-white shadow-white drop-shadow-md"
        >
          <div className="bg-red-400 text-white rounded-full p-1">
            <DollarSign size={16} />
          </div>
          <span className="text-sm">สร้างรายได้</span>
        </Link>
        <AuthButton />
      </div>
    </div>
  );
}
