import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import React from "react";
import { OrderList } from "./OrderList";
import { mails } from "../data/data";

export default function OrderListComponent() {
  return (
    <div>
      {/* <div className="flex items-center px-4 py-2">
        <div>
          <Button value="all" className="text-zinc-600 dark:text-zinc-200">
            All mail
          </Button>
        </div>
      </div> */}
      {/* <Separator /> */}
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <div className="m-0">
        <OrderList items={mails} />
      </div>
    </div>
  );
}
