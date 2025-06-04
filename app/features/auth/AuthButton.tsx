import React from "react";
import { getSession } from "@/lib/session";
import Link from "next/link";
import SignOutButton from "@/app/features/auth/SignOutButton";

export default async function AuthButton() {
  const session = await getSession();
  return (
    <div className="flex items-center gap-4">
      {!session || !session.user ? (
        <>
          <Link className="text-white" href={"/login"}>
            เข้าสู่ระบบ
          </Link>
          <Link className="text-white" href={"/register"}>
            ลงทะเบียน
          </Link>
        </>
      ) : (
        <>
          <div className="hidden md:block">
            {session.user.displayName ? (
              <div className="text-sm font-medium text-white">
                {session.user.displayName}
              </div>
            ) : null}
            {session && session.user && session.user.email ? (
              <div className="text-xs text-gray-200">{session.user.email}</div>
            ) : null}
          </div>
          <SignOutButton />
          {session.user.role === "admin" && (
            <Link
              href={"/admin"}
              className="z-50 absolute top-0 right-1/2 translate-x-1/2 hover:bg-green-500 hover:text-white text-center text-xs font-semibold text-white px-4 py-1 bg-blue-700 rounded-b-lg shadow-md border-b border-x border-white"
            >
              ไปที่หน้า Admin
            </Link>
          )}
        </>
      )}
    </div>
  );
}
