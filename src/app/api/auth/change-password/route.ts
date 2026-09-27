import { NextResponse } from "next/server";
import { getSession, signSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Current and new passwords are required" }, { status: 400 });
  if (String(newPassword).length < 8) return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
  if (String(newPassword) === String(currentPassword)) return NextResponse.json({ error: "New password must be different from the temporary password" }, { status: 400 });

  try {
    await callRetoolWorkflow({ action: "change_password", actor: session, currentPassword, newPassword });
    const nextSession = { ...session, mustChangePassword: false };
    const res = NextResponse.json({ ok: true, user: nextSession });
    res.cookies.set("ou_session", signSession(nextSession), { httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production", path:"/", maxAge:60*60*24*7 });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Could not change password" }, { status: 400 });
  }
}
