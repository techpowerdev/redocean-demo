import React from "react";
import { LoginForm } from "../../features/auth/forms/LoginForm";

export default function page() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}
