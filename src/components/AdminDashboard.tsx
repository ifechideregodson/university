"use client";

import { StatCard } from "@/components/StatCard";
import { LiveDashboard } from "@/components/LiveDashboard";

export function AdminDashboard() {
  return (
    <LiveDashboard
      action="admin_dashboard"
      fallback={
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="muted">Local university data is available while Retool is connecting.</p>
          <div className="grid grid-4" style={{ marginTop: 20 }}>
            <StatCard label="Students" value={1} />
            <StatCard label="Lecturers" value={1} />
            <StatCard label="Courses" value={3} />
            <StatCard label="Pending Admissions" value={0} />
          </div>
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            <div className="card">
              <h2>Academic Session</h2>
              <p><strong>2026/2027 Academic Session</strong> · First semester</p>
            </div>
            <div className="card">
              <h2>Administration</h2>
              <p className="muted">Students, admissions, courses, examinations, finance, reports and system controls are available from the sidebar.</p>
            </div>
          </div>
        </div>
      }
      render={(d) => (
        <>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="muted">Live university administration</p>
          <div className="grid grid-4" style={{ marginTop: 20 }}>
            <StatCard label="Students" value={d.students ?? 0} />
            <StatCard label="Lecturers" value={d.lecturers ?? 0} />
            <StatCard label="Programmes" value={d.programmes ?? 0} />
            <StatCard label="Pending Admissions" value={d.pendingAdmissions ?? 0} />
          </div>
          <div className="grid grid-2" style={{ marginTop: 20 }}>
            <div className="card">
              <h2>Academic Session</h2>
              <p>
                <strong>{d.session?.name || "Not configured"}</strong> ·{" "}
                {d.session?.semester || ""}
              </p>
            </div>
            <div className="card">
              <h2>Administration</h2>
              <p className="muted">
                Use the navigation to manage students, admissions, courses,
                examinations, finance and results.
              </p>
            </div>
          </div>
        </>
      )}
    />
  );
}
