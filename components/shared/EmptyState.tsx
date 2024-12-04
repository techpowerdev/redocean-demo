import React from "react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  icon: LucideIcon;
  message: string;
  link?: string;
  linkText?: string;
  linkIcon?: React.ReactNode;
};

export default function EmptyState({
  icon: Icon,
  message,
  link,
  linkText,
  linkIcon,
}: Props) {
  return (
    <div className="py-28 flex flex-col items-center text-center">
      <Icon size={40} className="text-gray-500" />
      <div className="text-xl mt-4 text-gray-700">{message}</div>
      {link && linkText && (
        <div>
          <Link
            href={link}
            className="text-slate-500 flex items-center gap-1 mt-2 hover:underline"
          >
            {linkIcon}
            <span>{linkText}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
