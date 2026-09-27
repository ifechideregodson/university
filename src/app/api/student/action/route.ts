import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";

const allowed = new Set(["register_courses"]);

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const action = String(body.action || "");
    if (!allowed.has(action)) {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }

    const courseIds = Array.isArray(body.courseIds) ? body.courseIds.map(String) : [];
    if (courseIds.length === 0) {
      return NextResponse.json({ error: "Select at least one course" }, { status: 400 });
    }

    const result = await callRetoolWorkflow({
      action,
      actor: session,
      studentId: session.id,
      courseIds,
      sessionId: body.sessionId || "current",
      semesterId: body.semesterId || "current",
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Course registration failed" },
      { status: 500 }
    );
  }
}
