import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedArea = path.startsWith("/student") || path.startsWith("/lecturer") || path.startsWith("/admin");
  if (!protectedArea) return NextResponse.next();
  const session = verifySession(request.cookies.get("ou_session")?.value);
  if (!session) return NextResponse.redirect(new URL("/login", request.url));
  if (path.startsWith("/student") && session.role !== "student") return NextResponse.redirect(new URL("/login", request.url));
  if (path.startsWith("/lecturer") && session.role !== "lecturer") return NextResponse.redirect(new URL("/login", request.url));
  if (path.startsWith("/admin") && session.role !== "admin") return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = { matcher: ["/student/:path*", "/lecturer/:path*", "/admin/:path*"] };
