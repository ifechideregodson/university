import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";
import { callSqliteFallback } from "@/lib/sqlite-fallback";

const allowed = new Set([
  "student_dashboard",
  "list_student_courses",
  "list_student_results",
  "list_student_payments",
  "lecturer_dashboard",
  "admin_dashboard",
  "list_courses",
  "list_students",
  "list_exams",
  "list_lecturer_courses",
  "list_course_students",
  "list_admissions",
  "list_payments",
  "list_announcements",
  "list_assignments",
  "list_materials",
  "list_results",
  "list_exam_attempts",
  "list_timetable",
  "list_attendance",
  "list_transcript",
  "list_notifications",
  "list_id_card",
  "list_reports",
  "list_academic_structure",
  "list_academic_sessions",
  "list_system_status",
]);

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const action = new URL(request.url).searchParams.get("action") || "";
    if (!allowed.has(action)) {
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
    }

    const payload = { action, actor: session };
    const data: any = await callRetoolWorkflow(payload);

    // The admin dashboard needs a known shape. If the Retool workflow
    // returns an empty/unexpected object, use the local SQLite data instead
    // of rendering an apparently blank dashboard.
    if (
      action === "admin_dashboard" &&
      (!data ||
        typeof data !== "object" ||
        typeof data.students !== "number" ||
        typeof data.lecturers !== "number")
    ) {
      return NextResponse.json(await callSqliteFallback(payload));
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Data request failed" },
      { status: 500 }
    );
  }
}
