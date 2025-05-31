import { authFetch } from "@/lib/authFetch";
import { deleteSession } from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";

export async function GET() {
  const response = await authFetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/signout`,
    {
      method: "POST",
    }
  );

  console.log("signout response", response);

  if (response.ok) {
    await deleteSession();
  }

  redirect("/", RedirectType.push);
}
