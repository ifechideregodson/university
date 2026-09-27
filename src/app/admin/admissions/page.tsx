"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, RefreshCw, UserPlus, XCircle } from "lucide-react";
import { PortalLayout } from "@/components/PortalLayout";

type Admission = {
  id: string;
  fullName: string;
  email: string;
  programme: string;
  status: string;
};

export default function Admissions() {
  const [rows, setRows] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "list_admissions" }),
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load applications");
      setRows(data.admissions || data.data || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to load applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function decide(id: string, action: "approve_admission" | "reject_admission") {
    setBusy(id + action);
    setNotice("");
    try {
      const response = await fetch("/api/admin/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, applicationId: id }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Action failed");

      if (action === "approve_admission") {
        setNotice(
          data.temporaryPassword
            ? `Admission approved. Student account created. Temporary password: ${data.temporaryPassword}`
            : "Admission approved and student account creation was requested."
        );
      } else {
        setNotice("Admission rejected.");
      }

      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Action failed");
    } finally {
      setBusy("");
    }
  }

  return (
    <PortalLayout role="admin" title="Admissions">
      <div className="page-head">
        <div>
          <h1 className="page-title">Admissions</h1>
          <p className="muted">Review applications and convert approved applicants into active student records.</p>
        </div>
        <button className="btn btn-secondary" onClick={load} disabled={loading}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {notice && (
        <div className="card" style={{ marginTop: 20 }}>
          <strong>{notice}</strong>
        </div>
      )}

      <div className="card" style={{ marginTop: 20, overflowX: "auto" }}>
        {loading ? (
          <p>Loading applications…</p>
        ) : rows.length === 0 ? (
          <p className="muted">No applications returned from the current data source.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Email</th>
                <th>Programme</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((application) => (
                <tr key={application.id}>
                  <td>{application.fullName || "—"}</td>
                  <td>{application.email || "—"}</td>
                  <td>{application.programme || "—"}</td>
                  <td>{application.status || "Pending"}</td>
                  <td>
                    {application.status?.toLowerCase() === "pending" ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-primary"
                          disabled={!!busy}
                          onClick={() => decide(application.id, "approve_admission")}
                        >
                          <CheckCircle2 size={16} />
                          {busy === application.id + "approve_admission" ? "Approving…" : "Approve & Admit"}
                        </button>
                        <button
                          className="btn"
                          disabled={!!busy}
                          onClick={() => decide(application.id, "reject_admission")}
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    ) : application.status?.toLowerCase() === "approved" ? (
                      <span className="muted"><UserPlus size={16} /> Student created</span>
                    ) : (
                      <span className="muted">Reviewed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PortalLayout>
  );
}
