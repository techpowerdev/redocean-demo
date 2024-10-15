"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { UserRoundCog } from "lucide-react";
import React from "react";

export default function Login() {
  const { liffLogin } = useUser();

  return (
    <div className="py-4 md:py-24">
      <div className="flex flex-col items-center gap-4">
        <UserRoundCog />
        <h1>กรุณาเชื่อมต่อบัญชี LINE</h1>
        <Button
          onClick={liffLogin}
          className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] bg-[#00b900] transition-colors flex items-center justify-center hover:bg-[#00b900]/85 dark:hover:bg-[#1a1a1a] hover:border-transparent text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          rel="noopener noreferrer"
        >
          เชื่อมต่อบัญชี
        </Button>
      </div>
    </div>
  );
}
