"use client";

import OTPDialog from "@/app/features/auth/forms/OTPDialog";
import LineLogin from "@/app/features/auth/LineLogin";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import React from "react";

export default function page() {
  const currentUser = useCurrentUserStore((state) => state.currentUser);

  if (!currentUser) {
    return <LineLogin />;
  }
  return (
    <div>
      <OTPDialog />
    </div>
  );
}
