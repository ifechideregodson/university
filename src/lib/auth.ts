import { createHmac, timingSafeEqual } from "node:crypto";

export type Session = {
  id: string;
  role: "student" | "lecturer" | "admin";
  name: string;
  email: string;
  mustChangePassword?: boolean;
};

const secret = () => process.env.AUTH_SECRET || "development-only-secret";

export function signSession(session: Session) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const sig = createHmac("sha256", secret()).update(payload).digest("base64url");
  return payload + "." + sig;
}

export function verifySession(token?: string): Session | null {
  try {
    if (!token) return null;
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
    const a = Buffer.from(sig), b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  } catch { return null; }
}

export async function getSession(): Promise<Session | null> {
  const { cookies } = await import("next/headers");
  return verifySession((await cookies()).get("ou_session")?.value);
}
