import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="content" style={{ maxWidth: 1000, margin: "40px auto" }}>
      <div className="card" style={{ padding: 32 }}>
        <div className="badge">ABOUT DOORWAY</div>
        <h1>Doorway Online Teaching Website</h1>
        <p>Doorway is being built as a connected digital education platform for teaching, learning and academic administration.</p>
        <h2>What Doorway brings together</h2>
        <ul>
          <li>Student learning and academic records</li>
          <li>Teacher teaching and assessment tools</li>
          <li>Admissions and student onboarding</li>
          <li>Courses, programmes and academic structure</li>
          <li>Examinations, results and reporting</li>
          <li>Education administration and communication</li>
        </ul>
        <Link className="btn btn-primary" href="/login">Enter Doorway</Link>
      </div>
    </main>
  );
}
