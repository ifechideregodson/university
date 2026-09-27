"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, CheckCircle2, RefreshCw, Save } from "lucide-react";
import { PortalLayout } from "@/components/PortalLayout";

type Course = { id: string; code?: string; title?: string; unit?: number; level?: number; semester?: string };

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadCourses() {
    setLoading(true);
    try {
      const response = await fetch("/api/data?action=list_courses");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load courses");
      setCourses(data.courses || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load courses.");
    } finally { setLoading(false); }
  }

  useEffect(() => { loadCourses(); }, []);

  const totalUnits = useMemo(
    () => courses.filter(c => selected.includes(c.id)).reduce((sum, c) => sum + Number(c.unit || 0), 0),
    [courses, selected]
  );

  async function register() {
    if (!selected.length) return;
    setSaving(true); setMessage("");
    try {
      const response = await fetch("/api/student/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register_courses", courseIds: selected }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      setMessage("Course registration submitted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed.");
    } finally { setSaving(false); }
  }

  return (
    <PortalLayout role="student" title="Course Registration">
      <div className="page-head">
        <div>
          <h1 className="page-title">Course Registration</h1>
          <p className="muted">Select courses for your current semester and submit your registration.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadCourses} disabled={loading}><RefreshCw size={16} /> Refresh</button>
      </div>

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        <div className="card"><span className="muted">Selected courses</span><h2>{selected.length}</h2></div>
        <div className="card"><span className="muted">Total units</span><h2>{totalUnits}</h2></div>
        <div className="card"><span className="muted">Registration</span><h2>{selected.length ? "Ready" : "Not started"}</h2></div>
      </div>

      {message && <div className="card" style={{ marginTop: 16 }}>{message}</div>}

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-title">
          <span><BookOpen size={18} /> Available Courses</span>
          <button className="btn btn-primary" onClick={register} disabled={!selected.length || saving}>
            <Save size={16} /> {saving ? "Saving..." : "Submit Registration"}
          </button>
        </div>
        {loading ? <p className="muted">Loading courses...</p> : courses.length === 0 ? <p className="muted">No courses are available yet.</p> : (
          <div className="list">
            {courses.map(course => {
              const checked = selected.includes(course.id);
              return (
                <label key={course.id} className="list-row" style={{ cursor: "pointer" }}>
                  <input type="checkbox" checked={checked} onChange={() => setSelected(current => current.includes(course.id) ? current.filter(x => x !== course.id) : [...current, course.id])} />
                  <div style={{ flex: 1 }}>
                    <strong>{course.code || "COURSE"} — {course.title || "Untitled course"}</strong>
                    <div className="muted">{course.unit || 0} unit(s) · Level {course.level || "—"} · {course.semester || "Current semester"}</div>
                  </div>
                  {checked && <CheckCircle2 size={20} />}
                </label>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
