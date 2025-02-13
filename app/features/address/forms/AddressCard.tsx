import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical } from "lucide-react";
import React from "react";
import EditAddressForm from "./EditAddressForm";
import { Badge } from "@/components/ui/badge";
import { useAddressStore } from "@/state-stores/addressStore";
import { Address } from "@/types/baseTypes";

type Props = {
  address: Address;
};
export default function AddressCard({ address }: Props) {
  const deleteAddress = useAddressStore((state) => state.deleteAddress);
  const changeActiveAddress = useAddressStore(
    (state) => state.changeActiveAddress
  );

  return (
    <div className="w-full flex flex-col items-start gap-2 p-2 cursor-pointer">
      <div className="w-full flex justify-between items-center gap-2">
        <div className="font-semibold">
          {address.recipient}{" "}
          {address.isActive && (
            <Badge variant={"destructive"} className="mx-1 rounded-full">
              ที่อยู่หลัก
            </Badge>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <EditAddressForm address={address} />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => changeActiveAddress(address.id, true)}
              >
                ตั้งเป็นที่อยู่หลัก
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => deleteAddress(address.id)}>
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
      <div className="space-x-1 leading-5">
        <span>{address.address}</span>
        <span>{address.street}</span>
        <span>{address.subDistrict}</span>
        <span>{address.district}</span>
        <span>{address.province}</span>
        <span>{address.postalCode}</span>
      </div>
      <div>เบอร์ติดต่อ {address.phoneNumber}</div>
    </div>
  );
}
