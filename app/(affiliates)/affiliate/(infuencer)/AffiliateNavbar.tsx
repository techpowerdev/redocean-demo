"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  links: {
    href: string;
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
  }[];
};

export default function AffiliateNavbar({ links }: Props) {
  const pathname = usePathname();
  return (
    <>
      {links.map((link, i) => (
        <Link
          key={`${link.href}-${i}`}
          href={link.href}
          className={cn(
            "flex items-center gap-2",
            pathname === link.href ? "text-primary" : "text-muted-foreground"
          )}
        >
          <link.icon className="h-5 w-5" />
          {link.label}
        </Link>
      ))}
    </>
  );
}
