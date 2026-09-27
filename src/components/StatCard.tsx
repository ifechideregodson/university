export function StatCard({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return <div className="card stat"><div><div className="muted">{label}</div><div className="stat-number">{value}</div>{note && <div className="muted">{note}</div>}</div></div>;
}
