"use client";

import { useEffect, useState } from "react";
import { Mail, RefreshCw, UserRound } from "lucide-react";
import { PortalLayout } from "@/components/PortalLayout";
import type { Student } from "@/lib/types";

export default function Profile() {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/data?action=student_dashboard", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load profile");
      setStudent(data.student || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  return (
    <PortalLayout role="student" title="Student Profile">
      <div className="page-head">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="muted">Your official student record as currently stored by Doorway.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadProfile} disabled={loading}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && <div className="card" style={{ marginTop: 20 }}><p>{error}</p></div>}

      {loading ? (
        <div className="card" style={{ marginTop: 20 }}><p className="muted">Loading your profile…</p></div>
      ) : student ? (
        <div className="grid grid-2" style={{ marginTop: 20 }}>
          <div className="card">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
              <UserRound size={24} />
              <div>
                <h2 className="section-title" style={{ margin: 0 }}>{student.name}</h2>
                <p className="muted">Student</p>
              </div>
            </div>
            <div className="list">
              <div className="list-row"><span>Matric No.</span><strong>{student.matricNo || "—"}</strong></div>
              <div className="list-row"><span>Programme</span><strong>{student.programme || "—"}</strong></div>
              <div className="list-row"><span>Level</span><strong>{student.level ? String(student.level) : "—"}</strong></div>
              <div className="list-row"><span>Status</span><strong>{student.status || "—"}</strong></div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 18 }}>
              <Mail size={24} />
              <div>
                <h2 className="section-title" style={{ margin: 0 }}>Contact</h2>
                <p className="muted">Account contact information</p>
              </div>
            </div>
            <div className="list">
              <div className="list-row"><span>Email</span><strong>{student.email || "—"}</strong></div>
              <div className="list-row"><span>Record ID</span><strong>{student.id}</strong></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card" style={{ marginTop: 20 }}>
          <p>No student profile is linked to your account yet. Please contact the registry.</p>
        </div>
      )}
    </PortalLayout>
  );
}
