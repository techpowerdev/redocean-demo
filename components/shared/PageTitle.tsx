import React from "react";

type Props = {
  title: string;
  className?: string;
};
export default function PageTitle({ title, className }: Props) {
  return <div className={`text-lg font-semibold ${className}`}>{title}</div>;
}
