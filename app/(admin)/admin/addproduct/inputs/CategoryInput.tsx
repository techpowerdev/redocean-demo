"use client";

import { IconType } from "react-icons";

interface CategoryInputProps {
  selected?: boolean;
  label: string;
  icon: IconType;
  onClick: (value: string) => void;
}
export default function CategoryInput({
  selected,
  label,
  icon: Icon,
  onClick,
}: CategoryInputProps) {
  return (
    <div
      onClick={() => {
        onClick(label);
      }}
      className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 
      hover:border-primary transition cursor-pointer
      ${selected ? "border-primary" : "border-slate-200"}
      `}
    >
      <Icon size={30} />
      <div className="font-light">{label}</div>
    </div>
  );
}
