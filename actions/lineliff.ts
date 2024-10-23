import liff from "@line/liff";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/state-stores/userStore";

export const useLiffActions = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setError = useUserStore((state) => state.setError);

  const liffLogin = async () => {
    try {
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const profile = await liff.getProfile();
        const user = {
          id: profile.userId,
          name: profile.displayName,
          email: liff.getDecodedIDToken()?.email || "",
          pictureUrl: profile.pictureUrl || "",
        };
        setUser(user);
        localStorage.setItem("LoggedInUser", JSON.stringify(user));
        toast.success("Login successful!");
      }
    } catch (err) {
      console.error("Failed to log in with LIFF", err);
      toast.error("Login failed");
      setError("Login failed");
    }
  };

  const liffLogout = () => {
    if (liff.isLoggedIn()) {
      liff.logout();
      setUser(null);
      localStorage.removeItem("LoggedInUser");
      toast.success("Logout successful!");
    } else {
      toast.error("Not logged in with LIFF");
    }
  };

  return { liffLogin, liffLogout };
};
