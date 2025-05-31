"use client";
import { useEffect } from "react";
import liff from "@line/liff";
import { lineLogin } from "@/services/authServices";
import { createSession } from "@/lib/session";
import { useRouter } from "next/navigation";

export default function LineLiffAutoLogin() {
  const router = useRouter();
  // Initialize LIFF and login if necessary
  useEffect(() => {
    const initializeLiff = async () => {
      try {
        await liff.init({ liffId: `${process.env.NEXT_PUBLIC_LINE_LIFF_ID}` }); // Replace with your LIFF ID

        // If already logged in, retrieve the user profile
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          console.log(profile);
          // try {
          const response = await lineLogin({
            lineUid: profile.userId,
            displayName: profile.displayName,
            email: liff.getDecodedIDToken()?.email || null,
            pictureUrl: profile.pictureUrl || null, // Add profile picture URL
          });

          const { user, accessToken, refreshToken } = response.data;
          await createSession({
            user: {
              id: user.id,
              email: user.email,
              displayName: user.displayName,
              role: user.role,
            },
            accessToken,
            refreshToken,
          });

          router.push("/");
        } else {
          liff.login();
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
