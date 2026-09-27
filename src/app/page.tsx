import Link from "next/link";
import { BookOpen, GraduationCap, Laptop, ShieldCheck, Users, Video } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Courses & Learning", text: "Organise programmes, courses, lessons, materials and assessments in one place." },
  { icon: Video, title: "Online Teaching", text: "Give teachers a dedicated space to teach, share materials and communicate with learners." },
  { icon: GraduationCap, title: "Student Portal", text: "Students can manage registration, courses, results, assignments and academic records." },
  { icon: Users, title: "People Management", text: "Manage students, teachers, departments, programmes and academic responsibilities." },
  { icon: ShieldCheck, title: "Administration", text: "Keep admissions, academic records, finance, examinations and reports organised." },
  { icon: Laptop, title: "Accessible Learning", text: "Designed for phones, computers and lower-bandwidth environments." },
];

export default function Home() {
  return (
    <main>
      <nav className="content" style={{ paddingTop: 24, paddingBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
          <strong style={{ fontSize: 22 }}>Doorway</strong>
          <div className="hero-actions" style={{ marginTop: 0 }}>
            <Link className="btn btn-secondary" href="/admission">Apply</Link>
            <Link className="btn btn-primary" href="/login">Sign in</Link>
          </div>
        </div>
      </nav>
      <section className="hero">
        <div style={{ maxWidth: 1100, margin: "auto" }}>
          <div className="badge">DOORWAY ONLINE TEACHING WEBSITE</div>
          <h1>A complete digital home for teaching, learning and education management.</h1>
          <p>Doorway brings students, teachers and administrators together in one platform for online learning, academic management, examinations, communication and student records.</p>
          <div className="hero-actions">
            <Link className="btn btn-primary" href="/login">Enter Portal</Link>
            <Link className="btn btn-secondary" href="/admission">Start an Application</Link>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="grid grid-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="card" key={title}><Icon size={28} /><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>
      <section className="content">
        <div className="card" style={{ padding: 28 }}>
          <h2>One platform. Three connected experiences.</h2>
          <div className="grid grid-3" style={{ marginTop: 20 }}>
            <div><h3>Students</h3><p>Learn, register courses, submit work, take exams and view results.</p></div>
            <div><h3>Teachers</h3><p>Teach courses, publish materials, manage assignments and grade learners.</p></div>
            <div><h3>Administration</h3><p>Manage admissions, people, academics, finance, examinations and reports.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}
