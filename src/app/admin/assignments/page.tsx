"use client";

import { useEffect, useMemo, useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";

type Lecturer = { id: string; fullName?: string; email?: string };
type Course = { id: string; code?: string; title?: string; unit?: number; level?: number; semester?: string };
type Session = { id: string; name?: string; semester?: string; status?: string };
type Assignment = { id: string; lecturerId?: string; courseId?: string; sessionId?: string; semester?: string; status?: string; assignedAt?: string };

async function getData(action: string) {
  const r = await fetch("/api/data?action=" + encodeURIComponent(action));
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Unable to load data");
  return d;
}

async function adminAction(action: string, payload: Record<string, unknown>) {
  const r = await fetch("/api/admin/action", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload }),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Operation failed");
  return d;
}

export default function LecturerAssignments() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [form, setForm] = useState({ lecturerId: "", courseId: "", sessionId: "", semester: "First" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const course = useMemo(() => courses.find(c => c.id === form.courseId), [courses, form.courseId]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [l, c, s, a] = await Promise.all([
        getData("list_lecturers"),
        getData("list_courses"),
        getData("list_academic_sessions"),
        getData("list_lecturer_assignments"),
      ]);
      setLecturers(l.lecturers || []);
      setCourses(c.courses || []);
      setSessions(s.sessions || []);
      setAssignments(a.assignments || []);
      if (!form.sessionId && (s.sessions || []).length) {
        const active = (s.sessions || []).find((x: Session) => String(x.status).toLowerCase() === "active") || s.sessions[0];
        setForm(f => ({ ...f, sessionId: active.id, semester: active.semester || "First" }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load assignment data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function assign(e: React.FormEvent) {
    e.preventDefault();
    if (!form.lecturerId || !form.courseId || !form.sessionId) {
      setError("Select a lecturer, course and academic session.");
      return;
    }
    setBusy("assign");
    setMessage("");
    setError("");
    try {
      await adminAction("assign_lecturer_course", {
        lecturerId: form.lecturerId,
        courseId: form.courseId,
        sessionId: form.sessionId,
        semester: form.semester || course?.semester || "First",
      });
      setMessage("Course assigned to lecturer successfully.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assignment failed");
    } finally {
      setBusy("");
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Remove this lecturer course assignment?")) return;
    setBusy(id);
    setMessage("");
    setError("");
    try {
      await adminAction("remove_lecturer_course", { assignmentId: id });
      setMessage("Assignment removed.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to remove assignment");
    } finally {
      setBusy("");
    }
  }

  const lecturerName = (id?: string) => lecturers.find(l => l.id === id)?.fullName || lecturers.find(l => l.id === id)?.email || id || "—";
  const courseName = (id?: string) => {
    const c = courses.find(x => x.id === id);
    return c ? c.code + " — " + c.title : id || "—";
  };
  const sessionName = (id?: string) => sessions.find(s => s.id === id)?.name || id || "—";

  return (
    <PortalLayout role="admin" title="Lecturer Assignments">
      <div className="page-head">
        <div>
          <h1 className="page-title">Lecturer Course Assignments</h1>
          <p className="muted">Assign approved courses to lecturers for a specific academic session and semester.</p>
        </div>
        <button className="button secondary" onClick={load} disabled={loading}>Refresh</button>
      </div>

      {message && <div className="card" style={{ marginTop: 16 }}><p>{message}</p></div>}
      {error && <div className="card" style={{ marginTop: 16 }}><p className="error">{error}</p></div>}

      <form className="card" style={{ marginTop: 20 }} onSubmit={assign}>
        <h2>New Assignment</h2>
        <div className="grid-2">
          <label>Lecturer
            <select value={form.lecturerId} onChange={e => setForm({ ...form, lecturerId: e.target.value })} required>
              <option value="">Select lecturer</option>
              {lecturers.map(l => <option key={l.id} value={l.id}>{l.fullName || l.email}</option>)}
            </select>
          </label>
          <label>Course
            <select value={form.courseId} onChange={e => {
              const id = e.target.value;
              const selected = courses.find(c => c.id === id);
              setForm({ ...form, courseId: id, semester: selected?.semester || form.semester });
            }} required>
              <option value="">Select course</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.code} — {c.title}</option>)}
            </select>
          </label>
          <label>Academic Session
            <select value={form.sessionId} onChange={e => setForm({ ...form, sessionId: e.target.value })} required>
              <option value="">Select session</option>
              {sessions.map(s => <option key={s.id} value={s.id}>{s.name} ({s.semester})</option>)}
            </select>
          </label>
          <label>Semester
            <select value={form.semester} onChange={e => setForm({ ...form, semester: e.target.value })}>
              <option>First</option><option>Second</option><option>Summer</option>
            </select>
          </label>
        </div>
        <button className="button" type="submit" disabled={busy === "assign"} style={{ marginTop: 16 }}>
          {busy === "assign" ? "Assigning…" : "Assign Lecturer to Course"}
        </button>
      </form>

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Current Assignments</h2>
        <p className="muted">{loading ? "Loading…" : assignments.length + " assignment(s)"}</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Lecturer</th><th>Course</th><th>Session</th><th>Semester</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {assignments.length ? assignments.map(a => (
                <tr key={a.id}>
                  <td>{lecturerName(a.lecturerId)}</td>
                  <td>{courseName(a.courseId)}</td>
                  <td>{sessionName(a.sessionId)}</td>
                  <td>{a.semester || "—"}</td>
                  <td>{a.status || "Active"}</td>
                  <td><button className="btn" disabled={busy === a.id} onClick={() => remove(a.id)}>{busy === a.id ? "Removing…" : "Remove"}</button></td>
                </tr>
              )) : <tr><td colSpan={6} className="muted">No lecturer course assignments yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
