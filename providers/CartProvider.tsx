"use client";

import { CartContextProvider } from "@/hooks/useCart";

interface CartProdiverProps {
  children: React.ReactNode;
}

const CartProvider: React.FC<CartProdiverProps> = ({ children }) => {
  return <CartContextProvider>{children}</CartContextProvider>;
};

export default CartProvider;
