import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";
import { randomBytes } from "node:crypto";

const ACTIONS = new Set([
  "list_students","list_admissions","approve_admission","reject_admission",
  "create_course","update_course","publish_result","list_payments",
  "create_announcement","create_user","update_student_status","list_exams",
  "create_exam","reset_student_password"
]);

function generateTemporaryPassword() {
  return "OU-" + randomBytes(6).toString("base64url").replace(/[-_]/g, "").slice(0, 8) + "!";
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const body = await request.json().catch(() => null);
  if (!body?.action || !ACTIONS.has(body.action)) return NextResponse.json({ error: "Unsupported admin action" }, { status: 400 });

  try {
    const payload: any = { ...body, actor: session };
    if (body.action === "reset_student_password") {
      const temporaryPassword = generateTemporaryPassword();
      const result: any = await callRetoolWorkflow({
        ...payload,
        password: temporaryPassword,
        mustChangePassword: true,
      });
      return NextResponse.json({
        ...result,
        temporaryPassword,
        passwordNotice: "Give this temporary password to the student securely. It is shown only now.",
      });
    }

    if (body.action === "create_user" && body.user?.role === "student") {
      const temporaryPassword = generateTemporaryPassword();
      payload.password = temporaryPassword;
      payload.user = { ...body.user, mustChangePassword: true };
      const result: any = await callRetoolWorkflow(payload);
      return NextResponse.json({ ...result, temporaryPassword, passwordNotice: "Give this temporary password to the student securely. It is shown only now." });
    }
    return NextResponse.json(await callRetoolWorkflow(payload));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Request failed" }, { status: 502 });
  }
}
