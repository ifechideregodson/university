import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = process.env.SQLITE_DATA_DIR || path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, "university.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`CREATE TABLE IF NOT EXISTS records (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity TEXT NOT NULL,
  record_key TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(entity, record_key)
);
CREATE INDEX IF NOT EXISTS idx_records_entity ON records(entity);`);

type Payload = { action?: string; actor?: Record<string, unknown>; [key: string]: unknown };

function upsert(entity: string, key: string, data: unknown) {
  const now = new Date().toISOString();
  db.prepare(`INSERT INTO records(entity,record_key,data,created_at,updated_at) VALUES(?,?,?,?,?)
    ON CONFLICT(entity,record_key) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at`)
    .run(entity, key, JSON.stringify(data), now, now);
}

function list(entity: string) {
  return db.prepare("SELECT record_key,data,created_at,updated_at FROM records WHERE entity=? ORDER BY id DESC")
    .all(entity)
    .map((r: any) => ({ id: r.record_key, ...JSON.parse(r.data), createdAt: r.created_at, updatedAt: r.updated_at }));
}

function first(entity: string, key: string) {
  const row = db.prepare("SELECT record_key,data,created_at,updated_at FROM records WHERE entity=? AND record_key=?").get(entity, key) as any;
  return row ? { id: row.record_key, ...JSON.parse(row.data), createdAt: row.created_at, updatedAt: row.updated_at } : null;
}

function safeUser(user: any) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

function seed() {
  const hasUsers = db.prepare("SELECT 1 FROM records WHERE entity='users' LIMIT 1").get();
  if (hasUsers) return;

  const seedUsers = [
    { id: "demo-student", email: "student@example.com", password: "student123", role: "student", fullName: "Demo Student" },
    { id: "demo-lecturer", email: "lecturer@example.com", password: "lecturer123", role: "lecturer", fullName: "Demo Lecturer" },
    { id: "demo-admin", email: "admin@example.com", password: "admin123", role: "admin", fullName: "Demo Admin" }
  ];

  const seedStudents = [
    { id: "stu-001", matricNo: "OU/2026/0001", name: "Demo Student", email: "student@example.com", programme: "Computer Science", level: 100, status: "Active" }
  ];

  const seedCourses = [
    { id: "csc101", code: "CSC101", title: "Introduction to Computer Science", unit: 3, level: 100, semester: "First" },
    { id: "csc201", code: "CSC201", title: "Data Structures", unit: 3, level: 200, semester: "First" },
    { id: "mat101", code: "MAT101", title: "Elementary Mathematics", unit: 3, level: 100, semester: "First" }
  ];

  const seedExams = [{
    id: "exam-001",
    courseId: "csc101",
    title: "CSC101 Mid-Semester Test",
    durationMinutes: 30,
    published: true,
    questions: []
  }];

  for (const u of seedUsers) upsert("users", u.id, u);
  for (const s of seedStudents) upsert("students", s.id, s);
  for (const c of seedCourses) upsert("courses", c.id, c);
  for (const e of seedExams) upsert("exams", e.id, e);

  upsert("course_registrations", "demo-registration-1", {
    studentId: "demo-student",
    courseIds: ["csc101", "csc201", "mat101"],
    status: "Registered"
  });

  upsert("academic_sessions", "demo-session", {
    name: "2026/2027 Academic Session",
    semester: "First"
  });
}

seed();

export async function callSqliteFallback(payload: Payload): Promise<any> {
  const action = String(payload.action || "");
  const actor = payload.actor || {};
  const now = new Date().toISOString();

  if (action === "admin_dashboard") {
    const users = list("users");
    const students = list("students");
    const courses = list("courses");
    const admissions = list("admissions");
    const sessions = list("academic_sessions");
    return {
      source: "sqlite-fallback",
      students: students.length,
      lecturers: users.filter((u: any) => u.role === "lecturer").length,
      programmes: courses.length,
      pendingAdmissions: admissions.filter((a: any) => String(a.status || "").toLowerCase() === "pending").length,
      session: sessions[0] || null
    };
  }

  if (action === "student_dashboard") {
    const registrations = list("course_registrations").filter((r: any) => String(r.studentId || "") === String(actor.id || ""));
    const results = list("results").filter((r: any) => String(r.studentId || "") === String(actor.id || ""));
    const payments = list("payments").filter((p: any) => String(p.studentId || "") === String(actor.id || ""));
    const exams = list("exams").filter((e: any) => e.published !== false);
    const student = list("students").find((s: any) => String(s.email || "").toLowerCase() === String(actor.email || "").toLowerCase()) || null;
    return {
      source: "sqlite-fallback",
      student,
      registeredCourses: (registrations[0]?.courseIds || []).length,
      cgpa: results.length ? "—" : "—",
      upcomingExams: exams.length,
      outstandingFees: payments
        .filter((p: any) => String(p.status || "").toLowerCase() !== "paid")
        .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0) || "₦0"
    };
  }

  if (action === "lecturer_dashboard") {
    const courses = list("courses");
    return {
      source: "sqlite-fallback",
      assignedCourses: courses.length,
      students: list("students").length,
      pendingGrading: list("assignment_submissions").filter((s: any) => String(s.status || "").toLowerCase() !== "graded").length,
      upcomingExams: list("exams").filter((e: any) => e.published !== false).length,
      courses,
      assignments: list("assignments"),
      materials: list("materials")
    };
  }

  if (action === "login_user") {
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "");
    const user = list("users").find((u: any) => String(u.email || "").toLowerCase() === email && u.password === password);
    return { source: "sqlite-fallback", user: safeUser(user) };
  }

  if (action === "register_user") {
    const user = (payload.user || {}) as Record<string, any>;
    const email = String(user.email || "").trim().toLowerCase();
    if (!email || !user.fullName || !user.role) throw new Error("Registration fields are incomplete");
    if (list("users").some((u: any) => String(u.email || "").toLowerCase() === email)) {
      throw new Error("An account with this email already exists");
    }
    const id = String(user.id || `user-${Date.now()}`);
    upsert("users", id, { ...user, id, email, password: String(payload.password || "") });
    if (user.role === "student") {
      upsert("students", id, { id, name: user.fullName, email, status: "Pending" });
    }
    return { ok: true, source: "sqlite-fallback", user: safeUser({ ...user, id, email }) };
  }

  if (action === "change_password") {
    const email = String(actor.email || "").toLowerCase();
    const user = list("users").find((u: any) => String(u.email || "").toLowerCase() === email);
    if (!user || user.password !== String(payload.currentPassword || "")) throw new Error("Current password is incorrect");
    upsert("users", user.id, { ...user, password: String(payload.newPassword || "") });
    return { ok: true, source: "sqlite-fallback" };
  }

  if (action === "submit_admission") {
    const application = (payload.application || {}) as Record<string, unknown>;
    const key = String(application.id || `admission-${Date.now()}`);
    upsert("admissions", key, { ...application, status: "Pending", submittedAt: now });
    return { ok: true, source: "sqlite-fallback", id: key, status: "Pending" };
  }

  if (action === "list_admissions") {
    return { source: "sqlite-fallback", admissions: list("admissions") };
  }

  if (action === "approve_admission" || action === "reject_admission") {
    const id = String(payload.admissionId || payload.id || "");
    const admission = first("admissions", id);
    if (!admission) throw new Error("Admission not found");
    const status = action === "approve_admission" ? "Approved" : "Rejected";
    upsert("admissions", id, { ...admission, status, reviewedAt: now, reviewedBy: actor.id || null });
    return { ok: true, source: "sqlite-fallback", id, status };
  }

  if (action === "list_courses" || action === "list_lecturer_courses") return { source: "sqlite-fallback", courses: list("courses") };
  if (action === "list_students" || action === "list_course_students") return { source: "sqlite-fallback", students: list("students") };
  if (action === "list_exams") return { source: "sqlite-fallback", exams: list("exams") };
  if (action === "list_exam_attempts") return { source: "sqlite-fallback", attempts: list("exam_attempts") };
  if (action === "list_student_courses") return { source: "sqlite-fallback", courses: list("course_registrations") };
  if (action === "list_student_results") return { source: "sqlite-fallback", results: list("results") };
  if (action === "list_student_payments" || action === "list_payments") return { source: "sqlite-fallback", payments: list("payments") };
  if (action === "list_announcements") return { source: "sqlite-fallback", announcements: list("announcements") };
  if (action === "list_assignments") return { source: "sqlite-fallback", assignments: list("assignments") };
  if (action === "list_materials") return { source: "sqlite-fallback", materials: list("materials") };
  if (action === "list_results") return { source: "sqlite-fallback", results: list("results") };

  if (action === "register_courses") {
    const key = `registration-${String(payload.studentId || actor.id || "student")}-${Date.now()}`;
    upsert("course_registrations", key, {
      studentId: payload.studentId || actor.id,
      courseIds: payload.courseIds,
      sessionId: payload.sessionId,
      semesterId: payload.semesterId,
      status: "Registered"
    });
    return { ok: true, source: "sqlite-fallback", id: key };
  }

  if (action === "submit_exam") {
    const key = `attempt-${String(payload.studentId || actor.id || "student")}-${Date.now()}`;
    upsert("exam_attempts", key, {
      studentId: payload.studentId || actor.id,
      examId: payload.examId,
      answers: payload.answers,
      submittedAt: now
    });
    return { ok: true, source: "sqlite-fallback", id: key };
  }

  if (action === "update_student_status") {
    const id = String(payload.studentId || payload.id || "");
    const student = first("students", id);
    if (!student) throw new Error("Student not found");
    upsert("students", id, { ...student, status: payload.status, updatedBy: actor.id || null });
    return { ok: true, source: "sqlite-fallback", id, status: payload.status };
  }

  const map: Record<string, string> = {
    create_course: "courses",
    update_course: "courses",
    create_material: "materials",
    create_assignment: "assignments",
    create_exam: "exams",
    create_question: "questions",
    publish_result: "results",
    grade_assignment: "assignment_grades",
    initialize_payment: "payments",
    create_announcement: "announcements",
    create_user: "users"
  };

  if (map[action]) {
    const keyName =
      action === "create_course" || action === "update_course" ? "course" :
      action.replace("create_", "").replace("publish_", "").replace("grade_", "").replace("initialize_", "");

    const data = (
      payload[keyName] ||
      payload.result ||
      payload.grade ||
      payload.submission ||
      payload.payment ||
      payload.announcement ||
      payload.user ||
      {}
    ) as Record<string, unknown>;

    const key = String(data.id || data.code || data.email || `${keyName}-${Date.now()}`);
    upsert(map[action], key, {
      ...data,
      createdBy: actor.id || null,
      updatedAt: now
    });

    return { ok: true, source: "sqlite-fallback", id: key };
  }

  throw new Error(`SQLite fallback does not support action: ${action}`);
}
