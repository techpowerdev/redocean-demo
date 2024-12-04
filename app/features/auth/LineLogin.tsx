import { UserRoundCog } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function LineLogin() {
  return (
    <div className="py-4 md:py-24">
      <div className="flex flex-col items-center gap-4">
        <UserRoundCog />
        <h1>กรุณาเชื่อมต่อบัญชี LINE</h1>
        <Link
          href={"/login-line"}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] bg-[#00b900] transition-colors flex items-center justify-center hover:bg-[#00b900]/85 dark:hover:bg-[#1a1a1a] hover:border-transparent text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        >
          เชื่อมต่อบัญชี
        </Link>
      </div>
    </div>
  );
}
