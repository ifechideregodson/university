import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";
import { randomBytes } from "node:crypto";

function generateTemporaryPassword() {
  return "DW-" + randomBytes(6).toString("base64url").replace(/[-_]/g, "").slice(0, 8) + "!";
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.action || !["list_admissions", "approve_admission", "reject_admission"].includes(body.action)) {
    return NextResponse.json({ error: "Invalid admission action" }, { status: 400 });
  }

  try {
    const payload: any = { ...body, actor: session };

    if (body.action === "approve_admission") {
      const temporaryPassword = generateTemporaryPassword();
      payload.temporaryPassword = temporaryPassword;
      payload.mustChangePassword = true;
      const result: any = await callRetoolWorkflow(payload);

      return NextResponse.json({
        ...result,
        temporaryPassword,
        passwordNotice: "Give this temporary password to the admitted student securely. It is shown only now.",
      });
    }

    return NextResponse.json(await callRetoolWorkflow(payload));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Workflow failed" },
      { status: 502 }
    );
  }
}
