import React from "react";
import { RegisterForm } from "../../features/auth/forms/RegisterForm";

export default function page() {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
