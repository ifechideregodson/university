"use client";

import { useEffect, useState } from "react";

type Props = {
  action: string;
  fallback: React.ReactNode;
  render: (data: any) => React.ReactNode;
};

export function LiveDashboard({ action, fallback, render }: Props) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetch(`/api/data?action=${encodeURIComponent(action)}`, { cache: "no-store" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(body?.error || `Request failed (${response.status})`);
        }
        return body;
      })
      .then((body) => {
        if (!active) return;
        setData(body);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Unable to load university data");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [action]);

  if (loading && !data) {
    return (
      <div>
        <div className="card">
          <p className="muted">Loading university data…</p>
        </div>
        <div style={{ marginTop: 16 }}>{fallback}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        {fallback}
        {error && (
          <div className="card" style={{ marginTop: 16 }}>
            <strong>Data connection notice</strong>
            <p className="muted" style={{ marginTop: 6 }}>
              {error}. The dashboard is showing its local fallback where available.
            </p>
          </div>
        )}
      </div>
    );
  }

  return <>{render(data)}</>;
}
