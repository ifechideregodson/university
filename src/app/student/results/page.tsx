"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { PortalLayout } from "@/components/PortalLayout";

type ResultRow = {
  id?: string;
  courseCode?: string;
  code?: string;
  courseTitle?: string;
  title?: string;
  score?: number | string;
  total?: number | string;
  grade?: string;
  unit?: number | string;
  semester?: string;
  session?: string;
};

function displayScore(row: ResultRow) {
  if (row.score === undefined || row.score === null) return "—";
  return row.total ? `${row.score}/${row.total}` : String(row.score);
}

export default function Results() {
  const [rows, setRows] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadResults() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/data?action=list_student_results", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to load results");
      setRows(Array.isArray(data.results) ? data.results : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load results");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadResults();
  }, []);

  const totalUnits = useMemo(
    () => rows.reduce((sum, row) => sum + Number(row.unit || 0), 0),
    [rows]
  );

  return (
    <PortalLayout role="student" title="Academic Results">
      <div className="page-head">
        <div>
          <h1 className="page-title">Results</h1>
          <p className="muted">Published academic results for your student record.</p>
        </div>
        <button className="btn btn-secondary" onClick={loadResults} disabled={loading}>
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {error && <div className="card" style={{ marginTop: 20 }}><p>{error}</p></div>}

      <div className="grid grid-3" style={{ marginTop: 20 }}>
        <div className="card"><div className="muted">Published courses</div><h2>{rows.length}</h2></div>
        <div className="card"><div className="muted">Total units</div><h2>{totalUnits || "—"}</h2></div>
        <div className="card"><div className="muted">Status</div><h2>{loading ? "Loading…" : rows.length ? "Available" : "Pending"}</h2></div>
      </div>

      <div className="card" style={{ marginTop: 20, overflowX: "auto" }}>
        {loading ? (
          <p className="muted">Loading results…</p>
        ) : rows.length ? (
          <table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Title</th>
                <th>Score</th>
                <th>Grade</th>
                <th>Units</th>
                <th>Semester</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id || `${row.courseCode || row.code || "result"}-${index}`}>
                  <td>{row.courseCode || row.code || "—"}</td>
                  <td>{row.courseTitle || row.title || "—"}</td>
                  <td>{displayScore(row)}</td>
                  <td>{row.grade || "—"}</td>
                  <td>{row.unit ?? "—"}</td>
                  <td>{row.semester || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">No published results are available yet.</p>
        )}
      </div>
    </PortalLayout>
  );
}
