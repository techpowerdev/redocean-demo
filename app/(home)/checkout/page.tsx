"use client";

import React, { useState } from "react";
import CheckoutForm from "@/app/features/checkout/forms/CheckoutForm";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import LineLogin from "@/app/features/auth/LineLogin";
import AddressSelector, {
  Address,
} from "@/app/features/user/address/forms/AddressSelector";
import CheckoutFormNew from "@/app/features/checkout/forms/CheckoutFormNew";

export default function CheckOut() {
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  const [addresses, setAddresses] = useState([
    { id: 1, name: "John Doe", phone: "123456789", addressLine: "123 Main St" },
    {
      id: 2,
      name: "Jane Smith",
      phone: "987654321",
      addressLine: "456 Elm St",
    },
  ]);

  const [selectedAddress, setSelectedAddress] = useState<null | Address>(null);

  const handleAddAddress = (newAddress: Address) => {
    setAddresses([...addresses, newAddress]);
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
    console.log("Selected Address:", address);
  };

  if (!currentUser) {
    return <LineLogin />;
  }
  return (
    <div>
      {/* <h1>Shipping Address</h1>
      <AddressSelector
        addresses={addresses}
        onAddAddress={handleAddAddress}
        onSelectAddress={handleSelectAddress}
      />
      {selectedAddress && (
        <div>
          <h2>Selected Address</h2>
          <p>{selectedAddress.name}</p>
          <p>{selectedAddress.phone}</p>
          <p>{selectedAddress.addressLine}</p>
        </div>
      )} */}
      {/* <CheckoutForm userId={currentUser.id} /> */}
      <CheckoutFormNew />
    </div>
  );
}
