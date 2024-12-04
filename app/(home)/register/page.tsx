import React from "react";
import { RegisterForm } from "../../features/auth/forms/RegisterForm";

type Props = {};

export default function page({}: Props) {
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
}
