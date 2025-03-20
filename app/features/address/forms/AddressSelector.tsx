import React, { useEffect } from "react";
import AutocompleteAddressForm from "./CreateAddressForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import AddressCard from "./AddressCard";
import { useAddressStore } from "@/state-stores/addressStore";
import { getAllAddresses } from "@/services/addressServices";

export default function AddressSelector() {
  // global state
  const addresses = useAddressStore((state) => state.addresses);
  const selectAddress = useAddressStore((state) => state.selectAddress);
  const selectedAddress = useAddressStore((state) => state.selectedAddress);
  const setAddresses = useAddressStore((state) => state.setAddresses);

  useEffect(() => {
    const fetchAddress = async () => {
      const result = await getAllAddresses();
      const primaryAddress = result.data.find((address) => address.isActive);
      selectAddress(primaryAddress ?? result.data?.[0] ?? null);
      setAddresses(result.data);
    };
    fetchAddress();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">ที่อยู่ในการจัดส่ง</h1>
      <div className="flex justify-between items-center gap-2">
        <h1 className="font-semibold">เลือกที่อยู่ในการจัดส่ง</h1>
        <AutocompleteAddressForm />
      </div>
      <ScrollArea className="h-fit max-h-[260px] overflow-auto">
        {addresses && addresses.length > 0 ? (
          <RadioGroup
            defaultValue={selectedAddress ? selectedAddress.id : undefined}
            className="mt-2"
          >
            {addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => selectAddress(address)}
                className="flex justify-start items-center p-2 border rounded-sm"
              >
                <RadioGroupItem value={address.id} id={address.id} />
                <Label htmlFor={address.id} className="w-full font-light">
                  <AddressCard address={address} />
                </Label>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-red-500">ยังไม่มีที่อยู่</div>
        )}
      </ScrollArea>
    </div>
  );
}
