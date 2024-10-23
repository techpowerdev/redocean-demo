"use client";

import Container from "@/components/shared/Container";
import CartClient from "./components/CartClient";
import { useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Cart() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login"); // ถ้า user เป็น null ให้ redirect ไปที่หน้าแรก
      toast.error("กรุณาเชื่อมต่อไลน์");
    }
  }, [user, router]);

  return (
    <Container>
      {/* <CartClient currentUser={currentUser} /> */}
      <CartClient />
    </Container>
  );
}
