"use client";

import React, { useEffect, useState } from "react";
import { EditProfileForm } from "@/app/features/profile/forms/EditProfileForm";
import { getCurrentUser } from "@/services/authServices";
import { User } from "@/types/baseTypes";

type Props = {
  params: { id: string };
};
export default function ProfileDetail({ params }: Props) {
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      // @@@@@ getCurrentUser ถูก สร้างจาก authAxios ซึ่งมีการเรียกใช้ Server action ภายใน
      const profileResponse = await getCurrentUser();
      setProfile(profileResponse.data);
    };
    fetchProfile();
  }, [params.id]);

  if (!profile) {
    return (
      <div className="w-full flex justify-center items-center text-red-500 mt-4">
        ไม่พบข้อมูลผู้ใช้งาน
      </div>
    );
  }

  return (
    <div className="max-w-screen-sm mx-auto p-4 rounded-md shadow-md mt-4">
      <EditProfileForm user={profile} />
    </div>
  );
}
