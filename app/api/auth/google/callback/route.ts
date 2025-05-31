import { createSession } from "@/lib/session";
import { USER_ROLE } from "@/types/baseTypes";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const email = searchParams.get("email");
  const displayName = searchParams.get("displayName");
  const role = searchParams.get("role");
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");

  // if (!accessToken || !refreshToken || !userId || !email || !name || !role)
  if (!accessToken || !refreshToken || !userId || !role)
    throw new Error("Google Ouath Failed!");

  await createSession({
    user: {
      id: userId,
      email,
      displayName,
      role: role as USER_ROLE,
    },
    accessToken,
    refreshToken,
  });

  redirect("/");
}
