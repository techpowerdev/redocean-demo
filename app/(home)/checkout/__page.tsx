"use client";

import React from "react";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import LineLogin from "@/app/features/auth/LineLogin";
import CheckoutForm from "@/app/features/checkout/forms/CheckoutForm";
// import StripeCheckoutForm from "@/app/features/checkout/forms/StripeCheckoutForm";

export default function CheckOut() {
  const currentUser = useCurrentUserStore((state) => state.currentUser);
  // const [addresses, setAddresses] = useState([
  //   { id: 1, name: "John Doe", phone: "123456789", addressLine: "123 Main St" },
  //   {
  //     id: 2,
  //     name: "Jane Smith",
  //     phone: "987654321",
  //     addressLine: "456 Elm St",
  //   },
  // ]);

  // const [selectedAddress, setSelectedAddress] = useState<null | Address>(null);

  // const handleAddAddress = (newAddress: Address) => {
  //   setAddresses([...addresses, newAddress]);
  // };

  // const handleSelectAddress = (address: Address) => {
  //   setSelectedAddress(address);
  //   console.log("Selected Address:", address);
  // };

  if (!currentUser) {
    return <LineLogin />;
  }
  return (
    <div>
      <CheckoutForm />
      {/* <StripeCheckoutForm /> */}
    </div>
  );
}
