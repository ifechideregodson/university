import { NextResponse } from "next/server";
import { signSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";
import { callSqliteFallback } from "@/lib/sqlite-fallback";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  try {
    let result: any = null;
    try { result = await callRetoolWorkflow({ action: "login_user", email, password }); } catch {}
    if (!result?.user) result = await callSqliteFallback({ action: "login_user", email, password });
    const u = result?.user;
    if (!u) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const session = {
      id: u.id,
      role: u.role,
      name: u.fullName || u.name,
      email: u.email || email,
      mustChangePassword: Boolean(u.mustChangePassword),
    };
    const res = NextResponse.json({ user: session });
    res.cookies.set("ou_session", signSession(session), {
      httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
      path: "/", maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed" }, { status: 500 });
  }
}
