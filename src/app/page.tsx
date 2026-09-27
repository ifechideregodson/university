import Link from "next/link";
import { Laptop, ShieldCheck, WifiOff } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div style={{ maxWidth: 1100, margin: "auto" }}>
          <div className="badge">DOORWAY ONLINE TEACHING WEBSITE</div>
          <h1>Learn, teach and manage education online.</h1>
          <p>
            Doorway is a complete online teaching and learning platform for
            students, teachers and education administrators, with courses,
            examinations, results, academic records and low-bandwidth learning support.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/login">Enter Portal</Link>
            <Link className="btn btn-secondary" href="/admission">Apply for Admission</Link>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="grid grid-3">
          <div className="card"><Laptop /><h3>Online Teaching</h3></div>
          <div className="card"><WifiOff /><h3>Low-Bandwidth Ready</h3></div>
          <div className="card"><ShieldCheck /><h3>Education Management</h3></div>
        </div>
      </section>
    </>
  );
}
