import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession } from "./src/lib/auth";

export function middleware(request: NextRequest) {
  const session = verifySession(request.cookies.get("ou_session")?.value);
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith("/student") || pathname.startsWith("/lecturer") || pathname.startsWith("/admin")) {
    if (!session) return NextResponse.redirect(new URL("/login", request.url));
    if (session.mustChangePassword) return NextResponse.redirect(new URL("/change-password", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/student/:path*", "/lecturer/:path*", "/admin/:path*", "/change-password"],
};
