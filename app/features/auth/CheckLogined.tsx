"use client";
import { useEffect } from "react";
import { useCurrentUserStore } from "@/state-stores/useCurrentUserStore";
import liff from "@line/liff";
import axios from "axios";

export default function CheckLogined() {
  const setCurrentUser = useCurrentUserStore((state) => state.setCurrentUser);
  const setToken = useCurrentUserStore((state) => state.setToken);
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
          // console.log("Home Logined..");
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
          console.log(response);
          setCurrentUser(response.data.user);
          setToken(response.data.accessToken);
        } else {
          clearCurrentUser();
          // console.log("Not logined");
        }
      } catch (err) {
        console.error("Home Failed to initialize LIFF", err);
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
