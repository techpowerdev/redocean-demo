"use client";

import { Mail, Phone, Power, UserRoundPen } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { EditProfile } from "../../features/profile/forms/EditProfile";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import liff from "@line/liff";
import LineLogin from "@/app/features/auth/LineLogin";
import Container from "@/components/shared/Container";
// import { logoutUser } from "@/services/authServices";

export default function Profile() {
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const clearCurrentUser = useCurrentUserStore(
    (state) => state.clearCurrentUser
  );

  // logout
  const logout = async () => {
    if (liff.isLoggedIn()) {
      try {
        // await logoutUser();
        liff.logout();
        clearCurrentUser();
        toast.success("ออกจากระบบแล้ว");
      } catch (error) {
        console.error("Error logging out", error);
        toast.error("เกิดข้อผิดพลาดบางอย่าง");
      }
    }
  };

  if (!currentUser) {
    return <LineLogin />;
  }

  return (
    <Container>
      {/* <MobileContainer> */}
      <div className="flex flex-col items-center">
        <div className="flex flex-col gap-2">
          {currentUser?.pictureUrl && (
            <Image
              className="h-12 w-12 rounded-full border-2 border-primary"
              src={currentUser.pictureUrl}
              alt={currentUser.displayName || ""}
              width={48}
              height={48}
            />
          )}
          <span>{currentUser?.displayName}</span>
        </div>
        <div className="w-full flex flex-col gap-4 rounded-xl border bg-card text-card-foreground shadow p-4 my-2">
          <div className="flex justify-between gap-2 items-center">
            <h3 className="font-semibold leading-none tracking-tight">
              ข้อมูลส่วนตัว
            </h3>
            <EditProfile />
          </div>

          <div className="flex justify-start gap-2 items-center">
            <UserRoundPen />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">ชื่อ-สกุล</p>
              <p className="text-sm text-muted-foreground">
                {currentUser.fullName}
              </p>
            </div>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <Phone />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">เบอร์โทร</p>
              <p className="text-sm text-muted-foreground">
                {currentUser.phoneNumber}
              </p>
            </div>
          </div>
          <div className="flex justify-start gap-2 items-center">
            <Mail />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">อีเมล</p>
              <p className="text-sm text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-2">
          <Button
            onClick={logout}
            variant={"outline"}
            className="flex gap-1 hover:text-primary rounded-full"
          >
            <Power size={15} />
            ออกจากระบบ
          </Button>
        </div>
      </div>
      {/* </MobileContainer> */}
    </Container>
  );
}
