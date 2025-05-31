"use client";

import liff from "@line/liff";
import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function SignOutButton() {
  const logoutLiff = async () => {
    try {
      if (liff.isLoggedIn()) {
        liff.logout();
      }
    } catch (error) {
      console.error("Error logging out from line liff", error);
    }
  };
  return (
    <div className="flex justify-end p-2">
      <a href={"/api/auth/signout"}>
        <Button
          onClick={logoutLiff}
          variant="ghost"
          size="icon"
          className="text-white hover:text-red-500"
        >
          <LogOut className="h-5 w-5" />
          <span className="sr-only">ออกจากระบบ</span>
        </Button>
      </a>
    </div>
  );
}
