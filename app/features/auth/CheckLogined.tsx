"use client";
import { useEffect } from "react";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import liff from "@line/liff";
import { lineLogin } from "@/services/authServices";

export default function CheckLogined() {
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const setToken = useCurrentUserStore((state) => state.setToken);
  const setRefreshToken = useCurrentUserStore((state) => state.setRefreshToken);
  const clearCurrentUser = useCurrentUserStore(
    (state) => state.clearCurrentUser
  );

  // Initialize LIFF and login if necessary
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: `${process.env.NEXT_PUBLIC_LINE_LIFF_ID}` }); // Replace with your LIFF ID

        // If already logged in, retrieve the user profile
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          // try {
          const response = await lineLogin({
            lineUid: profile.userId,
            displayName: profile.displayName,
            email: liff.getDecodedIDToken()?.email || null,
            pictureUrl: profile.pictureUrl || null, // Add profile picture URL
          });
          setCurrentUser(response.data.user);
          setToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);
        } else {
          clearCurrentUser();
        }
      } catch (error) {
        console.error("Home Failed to initialize LIFF", error);
      }
    };

    initializeLiff();
  }, []);

  return (
    <div className="hidden">
      <h1>Welcome to Home Client</h1>
    </div>
  );
}
