"use client";

import { StatCard } from "@/components/StatCard";
import { LiveDashboard } from "@/components/LiveDashboard";

export function LecturerDashboard() {
  return (
    <LiveDashboard
      action="lecturer_dashboard"
      fallback={
        <div>
          <h1 className="page-title">Lecturer Dashboard</h1>
          <p className="muted">Connect Retool to load teaching records.</p>
        </div>
      }
      render={(d) => (
        <>
          <h1 className="page-title">Lecturer Dashboard</h1>
          <div className="grid grid-4" style={{ marginTop: 20 }}>
            <StatCard label="Assigned Courses" value={d.assignedCourses ?? 0} />
            <StatCard label="Students" value={d.students ?? 0} />
            <StatCard label="Pending Grading" value={d.pendingGrading ?? 0} />
            <StatCard label="Upcoming Exams" value={d.upcomingExams ?? 0} />
          </div>
        </>
      )}
    />
  );
}
