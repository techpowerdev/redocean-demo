"use client";
import { Edit, Mail, Phone, Power, UserRoundPen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Container from "@/components/shared/Container";
import { getCurrentUser } from "@/services/authServices";
import { useEffect, useState } from "react";
import { GetCurrentUserResponse } from "@/types/userTypes";
import liff from "@line/liff";
import Link from "next/link";

export default function Profile() {
  const [user, setUser] = useState<GetCurrentUserResponse["data"] | null>(null);

  const logoutLiff = async () => {
    try {
      if (liff.isLoggedIn()) {
        liff.logout();
      }
      setUser(null);
    } catch (error) {
      console.error("Error logging out from line liff", error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser.data);
    };
    fetch();
  }, []);

  if (!user) {
    return;
  }

  return (
    <Container>
      <div className="flex flex-col items-center py-4">
        <div className="flex flex-col items-center gap-2">
          <Image
            className="h-12 w-12 rounded-full border-2 border-primary"
            src={user.pictureUrl || "/user-profile.png"}
            alt={user.displayName || ""}
            width={48}
            height={48}
          />
          <span>{user.displayName}</span>
        </div>
        <div className="w-full flex flex-col gap-4 rounded-xl border bg-card text-card-foreground shadow p-4 my-2">
          <div className="flex justify-between gap-2 items-center">
            <h3 className="font-semibold leading-none tracking-tight">
              ข้อมูลส่วนตัว
            </h3>

            <Link href={`/profile/${user.id}`}>
              <Edit size={16} />
            </Link>
          </div>

          <div className="flex justify-start gap-2 items-center">
            <UserRoundPen />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">ชื่อ-สกุล</p>
              <p className="text-sm text-muted-foreground">{user.fullName}</p>
            </div>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <Phone />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">เบอร์โทร</p>
              <p className="text-sm text-muted-foreground">
                {user.phoneNumber}
              </p>
            </div>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <Mail />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">อีเมล</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-2">
          <a href={"/api/auth/signout"}>
            <Button
              onClick={logoutLiff}
              variant={"outline"}
              className="flex gap-1 hover:text-primary rounded-full"
            >
              <Power size={15} />
              ออกจากระบบ
            </Button>
          </a>
        </div>
      </div>
    </Container>
  );
}
