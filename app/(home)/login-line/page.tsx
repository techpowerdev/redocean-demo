"use client";

import Loading from "@/components/shared/Loading";
import { getCurrentUser, lineLogin } from "@/services/authServices";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import liff from "@line/liff";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const setToken = useCurrentUserStore((state) => state.setToken);

  // Initialize LIFF and login if necessary
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: `${process.env.NEXT_PUBLIC_LINE_LIFF_ID}` }); // Replace with your LIFF ID

        // If already logged in, send request to register/line api
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const response = await lineLogin({
            lineUid: profile.userId,
            displayName: profile.displayName,
            email: liff.getDecodedIDToken()?.email || null,
            pictureUrl: profile.pictureUrl || null, // Add profile picture URL
          });
          const user = await getCurrentUser();
          setCurrentUser(user.data);
          setToken(response.data.accessToken);
          toast.success("เชื่อมต่อกับไลน์แล้ว!");
          window.location.href = `/`;
        } else {
          liff.login();
        }
      } catch (err) {
        console.error("Failed to initialize LIFF", err);
      }
    };

    initializeLiff();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-screen justify-center items-center">
      <Loading size={40} />
    </div>
  );
}
