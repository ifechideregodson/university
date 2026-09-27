"use client";

import { useEffect, useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";

type Course = { id: string; code?: string; title?: string; unit?: number; level?: number; semester?: string };

export default function LecturerCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const r = await fetch("/api/data?action=list_lecturer_courses");
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Unable to load assigned courses");
      setCourses(d.courses || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load assigned courses");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <PortalLayout role="lecturer" title="Assigned Courses">
      <div className="page-head">
        <div>
          <h1 className="page-title">My Assigned Courses</h1>
          <p className="muted">These are the courses assigned to your lecturer account by university administration.</p>
        </div>
        <button className="button secondary" onClick={load} disabled={loading}>Refresh</button>
      </div>

      {error && <div className="card" style={{ marginTop: 16 }}><p className="error">{error}</p></div>}

      <div className="card" style={{ marginTop: 20 }}>
        <h2>Current Teaching Load</h2>
        <p className="muted">{loading ? "Loading…" : courses.length + " assigned course(s)"}</p>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Code</th><th>Course</th><th>Units</th><th>Level</th><th>Semester</th><th>Teaching Actions</th></tr></thead>
            <tbody>
              {courses.length ? courses.map(c => (
                <tr key={c.id}>
                  <td>{c.code || "—"}</td>
                  <td>{c.title || "—"}</td>
                  <td>{c.unit ?? "—"}</td>
                  <td>{c.level ?? "—"}</td>
                  <td>{c.semester || "—"}</td>
                  <td>
                    <span className="muted">Attendance · Materials · Assignments · Results</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="muted">No courses have been assigned to you yet. Contact university administration.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  );
}
