import React from "react";

export default function ActionBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-end items-center px-4 py-2 h-[52px]">
      {children}
    </div>
  );
}
