import { LucideIcon } from "lucide-react";

type CardProps = {
  title: string;
  value: number | string;
  Icon: LucideIcon;
};
export default function DashboardCard({ title, value, Icon }: CardProps) {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex px-1 py-2">
        {Icon ? <Icon className="h-5 w-5 text-primary" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
