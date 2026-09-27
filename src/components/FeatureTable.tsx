"use client";

import { useEffect, useState } from "react";

type Column = { key: string; label: string };

export function FeatureTable({
  title,
  description,
  action,
  columns,
  empty = "No records found.",
}: {
  title: string;
  description?: string;
  action: string;
  columns: Column[];
  empty?: string;
}) {
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/data?action=${encodeURIComponent(action)}`, { cache: "no-store" })
      .then(async r => r.ok ? r.json() : Promise.reject(await r.json().catch(() => ({}))))
      .then(d => {
        const value = d?.items ?? d?.records ?? d?.data ?? [];
        setRows(Array.isArray(value) ? value : []);
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [action]);

  return (
    <div>
      <h1 className="page-title">{title}</h1>
      {description && <p className="muted">{description}</p>}
      <div className="card" style={{ marginTop: 20 }}>
        {loading ? <p className="muted">Loading…</p> : rows.length === 0 ? (
          <p className="muted">{empty}</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr></thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={String(row.id ?? i)}>
                    {columns.map(c => <td key={c.key}>{String(row[c.key] ?? "—")}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
