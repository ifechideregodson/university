"use client";

import Link from "next/link";
import { StatCard } from "@/components/StatCard";
import { LiveDashboard } from "@/components/LiveDashboard";

export function StudentDashboard() {
  return (
    <LiveDashboard
      action="student_dashboard"
      fallback={
        <>
          <h1 className="page-title">Student Dashboard</h1>
          <p className="muted">Connect Retool to display live academic records.</p>
        </>
      }
      render={(d) => (
        <>
          <h1 className="page-title">Welcome, {d.student?.name || "Student"}</h1>
          <div className="grid grid-4" style={{ marginTop: 20 }}>
            <StatCard label="Registered Courses" value={d.registeredCourses ?? 0} />
            <StatCard label="Current CGPA" value={d.cgpa ?? "—"} />
            <StatCard label="Upcoming Exams" value={d.upcomingExams ?? 0} />
            <StatCard label="Outstanding Fees" value={d.outstandingFees ?? "₦0"} />
          </div>
          <Link className="btn btn-secondary" href="/student/courses" style={{ marginTop: 20 }}>
            Manage courses
          </Link>
        </>
      )}
    />
  );
}
