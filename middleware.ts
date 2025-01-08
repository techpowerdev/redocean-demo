// import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // const cookieStore = cookies();
  // const token = cookieStore.get("redocean_accessToken");
  // console.log("token", token);

  console.log("start middleware");
  const cookieHeader = request.headers.get("Cookie") || "";

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users/current-user`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieHeader,
        },
      }
    );
    // console.log(response.ok);
    // console.log(response.status);

    if (!response.ok) {
      console.error(
        "Error fetching data:",
        response.status,
        response.statusText
      );

      if (response.status === 401) {
        return NextResponse.redirect(new URL("/login-line", request.url));
      }

      return NextResponse.redirect(new URL("/", request.url));
    }

    const { data } = await response.json();

    const { pathname } = request.nextUrl;

    if (!data || !data.role) {
      console.error("Invalid response data:", data);
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/admin") && data.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/cart", "/orders", "/profile"],
};
