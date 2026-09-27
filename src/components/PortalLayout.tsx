import { Sidebar } from "./Sidebar";

export function PortalLayout({ role, children, title }: { role: "student" | "lecturer" | "admin"; children: React.ReactNode; title: string }) {
  return (
    <div className="shell">
      <Sidebar role={role} />
      <main className="main">
        <header className="topbar">
          <strong>{title}</strong>
          <span className="badge">{role.toUpperCase()}</span>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
