// import React, { useEffect } from "react";
// import AutocompleteAddressForm from "./CreateAddressForm";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import AddressCard from "./AddressCard";
// import { getAddress } from "@/services/addressServices";
// import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
// import { useAddressStore } from "@/state-stores/addressStore";

// export default function AddressSelector() {
//   // global state
//   const setAddresses = useAddressStore((state) => state.setAddresses);
//   const addresses = useAddressStore((state) => state.addresses);
//   const selectAddress = useAddressStore((state) => state.selectAddress);
//   const token = useCurrentUserStore((state) => state.token);
//   useEffect(() => {
//     const fetchAddreses = async () => {
//       const addresses = await getAddress();
//       setAddresses(addresses.data);
//     };
//     fetchAddreses();
//   }, []);
//   return (
//     <div>
//       <div className="flex justify-between items-center gap-2">
//         <h1 className="font-semibold">เลือกที่อยู่ในการจัดส่ง</h1>
//         <AutocompleteAddressForm />
//       </div>
//       <ScrollArea>
//         <RadioGroup defaultValue="r1" className="mt-2">
//           {addresses &&
//             addresses.map((address) => (
//               <div
//                 key={address.id}
//                 onClick={() => selectAddress(address)}
//                 className="flex justify-start items-center p-2 border rounded-sm"
//               >
//                 <RadioGroupItem value={address.id} id={address.id} />
//                 <Label htmlFor={address.id} className="w-full font-light">
//                   <AddressCard address={address} />
//                 </Label>
//               </div>
//             ))}
//         </RadioGroup>
//       </ScrollArea>
//     </div>
//   );
// }

import React from "react";
import AutocompleteAddressForm from "./CreateAddressForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import AddressCard from "./AddressCard";
import { useAddressStore } from "@/state-stores/addressStore";

export default function AddressSelector() {
  // global state
  const addresses = useAddressStore((state) => state.addresses);
  const selectAddress = useAddressStore((state) => state.selectAddress);
  const selectedAddress = useAddressStore((state) => state.selectedAddress);

  return (
    <div>
      <div className="flex justify-between items-center gap-2">
        <h1 className="font-semibold">เลือกที่อยู่ในการจัดส่ง</h1>
        <AutocompleteAddressForm />
      </div>
      <ScrollArea>
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
