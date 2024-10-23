"use client";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail } from "@/app/(admin)/admin/data/data";
import ToggleBooleanField from "./ToggleBooleanField";
import { Flame } from "lucide-react";
// import { useMail } from "@/app/(app)/examples/mail/use-mail";

interface Props {
  items: Mail[];
}

export function ProductList({ items }: Props) {
  // const [mail, setMail] = useMail();

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => (
          <div
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
                  <div className="font-semibold">{item.name}</div>
                  {!item.read && (
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
                  {formatDistanceToNow(new Date(item.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{item.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {item.text.substring(0, 300)}
            </div>
            <ToggleBooleanField
              initialStatus={false}
              fieldName="hotDeal"
              icon={Flame}
              apiEndpoint="/"
              id="12"
              label="Hot Deal"
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
