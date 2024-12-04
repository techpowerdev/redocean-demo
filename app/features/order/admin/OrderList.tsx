import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Separator } from "@/components/ui/separator";
import { OrderType } from "@/types/fetchTypes";
import { formatDateTimeTH } from "@/utils/formatDate";
// import { useMail } from "@/app/(app)/examples/mail/use-mail";

interface Props {
  items: OrderType[];
}

export function OrderList({ items }: Props) {
  // const [mail, setMail] = useMail();

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent"
              // mail.selected === item.id && "bg-muted"
            )}
            // onClick={() =>
            //   setMail({
            //     ...mail,
            //     selected: item.id,
            //   })
            // }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.orderType}</div>
                  {item.status === "pending" && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs"
                    // mail.selected === item.id
                    //   ? "text-foreground"
                    //   : "text-muted-foreground"
                  )}
                >
                  {formatDistanceToNow(new Date(item.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.status}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.trackingNumber?.substring(0, 300)}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getBadgeVariantFromLabel(item.status)}>
                {item.status}
              </Badge>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
