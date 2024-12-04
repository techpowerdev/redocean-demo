import { AddressType } from "@/types/addressTypes";
import React, { useState } from "react";

type Props = {
  addresses: AddressType[];
  onAddAddress: (newAddress: AddressType) => void;
  onSelectAddress: (selectedAddress: AddressType) => void;
};

export default function AddressSelector({
  addresses,
  onAddAddress,
  onSelectAddress,
}: Props) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressType>({
    recipient: "",
    phoneNumber: "",
    address: "",
    street: "",
    subDistrict: "",
    district: "",
    province: "",
    postalCode: "",
    isActive: false,
  });

  const handleAddAddress = () => {
    onAddAddress(newAddress);
    setShowAddForm(false);
    setNewAddress({
      recipient: "",
      phoneNumber: "",
      address: "",
      street: "",
      subDistrict: "",
      district: "",
      province: "",
      postalCode: "",
      isActive: false,
    });
  };

  return (
    <div className="address-selector">
      <h2>Select Address</h2>
      <ul>
        {addresses.map((address) => (
          <li key={address.id}>
            <div>
              <strong>{address.name}</strong>
              <p>{address.phone}</p>
              <p>{address.addressLine}</p>
              <button onClick={() => onSelectAddress(address)}>Select</button>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => setShowAddForm(!showAddForm)}>
        Add New Address
      </button>
      {showAddForm && (
        <div className="add-address-form">
          <input
            type="text"
            placeholder="Name"
            value={newAddress.name}
            onChange={(e) =>
              setNewAddress({ ...newAddress, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Phone"
            value={newAddress.phone}
            onChange={(e) =>
              setNewAddress({ ...newAddress, phone: e.target.value })
            }
          />
          <textarea
            placeholder="Address Line"
            value={newAddress.addressLine}
            onChange={(e) =>
              setNewAddress({ ...newAddress, addressLine: e.target.value })
            }
          />
          <button onClick={handleAddAddress}>Save Address</button>
        </div>
      )}
    </div>
  );
}
