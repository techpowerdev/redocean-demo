"use client";

import { UserContextProvider } from "@/hooks/useUser";

interface UserProdiverProps {
  children: React.ReactNode;
}

const UserProvider: React.FC<UserProdiverProps> = ({ children }) => {
  return <UserContextProvider>{children}</UserContextProvider>;
};

export default UserProvider;
