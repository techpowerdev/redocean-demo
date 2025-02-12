"use client";
import { getCurrentUser } from "@/services/authServices";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckPermission() {
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = await getCurrentUser();
      const role = currentUser.data.role;
      if (role !== "admin") {
        router.push("/");
      }
    };
    fetchCurrentUser();
  }, []);

  return <div className="hidden"></div>;
}
