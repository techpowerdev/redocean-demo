"use client";

import Loading from "@/components/shared/Loading";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import liff from "@line/liff";
import axios from "axios";

import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const setToken = useCurrentUserStore((state) => state.setToken);

  const setLoading = useCurrentUserStore((state) => state.setLoading);

  // Initialize LIFF and login if necessary
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: `${process.env.NEXT_PUBLIC_LINE_LIFF_ID}` }); // Replace with your LIFF ID

        // If already logged in, send request to register/line api
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/login/line`,
            {
              lineUid: profile.userId,
              displayName: profile.displayName,
              email: liff.getDecodedIDToken()?.email || null,
              pictureUrl: profile.pictureUrl || null, // Add profile picture URL
            }
          );
          setCurrentUser(response.data.user);
          setToken(response.data.accessToken);
          toast.success("เชื่อมต่อกับไลน์แล้ว!");
          window.location.href = `/`;
        } else {
          liff.login();
        }
      } catch (err) {
        console.error("Failed to initialize LIFF", err);
      } finally {
        setLoading(false);
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
