import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import liff from "@line/liff";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";

// Define User type
type User = {
  id: string;
  name: string;
  email: string;
  pictureUrl: string; // Add pictureUrl to store profile picture
};

type UserContextType = {
  user: User | null;
  loading: boolean;
  liffLogin: () => Promise<void>;
  liffLogout: () => void;
};

// Create the context and export it
export const UserContext = createContext<UserContextType | null>(null);

interface Props {
  [propName: string]: never;
}

export const UserContextProvider = (props: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [liffInitialized, setLiffInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // กำหนด type ของ loading เป็น boolean

  const { setCurrentUser } = useCurrentUserStore();
  // Initialize LIFF and login if necessary
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: `${process.env.NEXT_PUBLIC_LINE_LIFF_ID}` }); // Replace with your LIFF ID
        setLiffInitialized(true);

        // If already logged in, retrieve the user profile
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const userInfo = {
            id: profile.userId,
            name: profile.displayName,
            email: liff.getDecodedIDToken()?.email || "",
            pictureUrl: profile.pictureUrl || "", // Add profile picture URL
          };
          setUser(userInfo);
          // localStorage.setItem("LoggedInUser", JSON.stringify(userInfo));
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/register/line`,
            {
              lineId: profile.userId,
              displayName: profile.displayName,
              email: liff.getDecodedIDToken()?.email || null,
              pictureUrl: profile.pictureUrl || null, // Add profile picture URL
            }
          );
          setCurrentUser(response.data.user);
        }
      } catch (err) {
        console.error("Failed to initialize LIFF", err);
        setError("Failed to initialize LIFF");
      } finally {
        setLoading(false);
        console.log("login success");
      }
    };

    initializeLiff();
  }, []);

  // Handle LIFF login
  const liffLogin = useCallback(async () => {
    if (!liffInitialized) return;

    try {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const profile = await liff.getProfile();
        const user = {
          id: profile.userId,
          name: profile.displayName,
          email: liff.getDecodedIDToken()?.email || "",
          pictureUrl: profile.pictureUrl || "", // Add profile picture URL
        };
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/register/line`,
          {
            lineId: profile.userId,
            displayName: profile.displayName,
            email: liff.getDecodedIDToken()?.email || null,
            pictureUrl: profile.pictureUrl || null, // Add profile picture URL
          }
        );
        console.log(response.data);
        setUser(response.data.user);
        // localStorage.setItem("LoggedInUser", JSON.stringify(user));
        toast.success("Login successful!");
        window.location.href = "http://localhost:3000/profile";
      }
    } catch (err) {
      console.error("Failed to log in with LIFF", err);
      toast.error("Login failed");
    }
  }, [liffInitialized]);

  // Handle LIFF logout
  const liffLogout = useCallback(() => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setUser(null);
      // localStorage.removeItem("LoggedInUser");
      toast.success("Logout successful!");
    } else {
      toast.error("Not logged in with LIFF");
    }
  }, []);

  const value = {
    user,
    loading,
    error,
    liffLogin,
    liffLogout,
  };

  return <UserContext.Provider value={value} {...props} />;
};

// Export the user context for other components
export const useUser = () => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
};
