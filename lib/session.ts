// @@@@@@@@@@ ทำให้ทุกฟังก์ชั่นภายมในไฟล์นี้เป็น server action
"use server";

import { USER_ROLE } from "@/types/baseTypes";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Session = {
  user: {
    id: string;
    email: string | null;
    displayName: string | null;
    role: USER_ROLE;
  };
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);
const sessionJwtExpiresIn = process.env.SESSION_JWT_EXPIRES_IN || "7d";
const days = parseInt(process.env.SESSION_COOKIE_EXPIRES_IN_DAYS || "1", 10);
const sessonCookieExpiresIn = days * 24 * 60 * 60 * 1000;

// @@@@@@@ การสร้าง server action ต้องประกาศเป็น async function
export async function createSession(payload: Session) {
  // const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const expiredAt = new Date(Date.now() + sessonCookieExpiresIn); // 1 minute

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(sessionJwtExpiresIn)
    .sign(encodedKey);

  cookies().set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function getSession(): Promise<Session | null> {
  const cookie = cookies().get("session")?.value;
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (err) {
    console.error("Failed to verify the session", err);
    redirect("/login");
  }
}

export async function deleteSession() {
  cookies().delete("session");
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookie = cookies().get("session")?.value;
  if (!cookie) return null;

  let payload;
  try {
    ({ payload } = await jwtVerify(cookie, encodedKey));
  } catch (err) {
    console.error("Session expired or invalid during token update", err);
    return null;
  }

  const newPayload: Session = {
    user: {
      ...(payload.user as Session["user"]),
    },
    accessToken,
    refreshToken,
  };

  await createSession(newPayload);
}

// @@@@@@@ server action นี้สามารถนำไปเรียกใช้ที่ server (ใช้ได้ตรงๆเลย) /client component (มีวิธีการเรียกใช้ตามความเหมาะสม) ได้
