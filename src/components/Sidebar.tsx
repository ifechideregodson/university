"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ClipboardList, CreditCard, FileText, GraduationCap, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import type { Role } from "@/lib/types";

const links: Record<Role, { href: string; label: string; icon: React.ComponentType<{size?: number}> }[]> = {
  student: [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/courses", label: "Courses", icon: BookOpen },
    { href: "/student/exams", label: "Exams", icon: ClipboardList },
    { href: "/student/results", label: "Results", icon: GraduationCap },
    { href: "/student/assignments", label: "Assignments", icon: FileText },
    { href: "/student/payments", label: "Payments", icon: CreditCard },
    { href: "/student/profile", label: "Profile", icon: Users }
  ],
  lecturer: [
    { href: "/lecturer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/lecturer/courses", label: "Courses", icon: BookOpen },
    { href: "/lecturer/exams", label: "Exams", icon: ClipboardList },
    { href: "/lecturer/materials", label: "Materials", icon: FileText },
    { href: "/lecturer/assignments", label: "Assignments", icon: FileText },
    { href: "/lecturer/results", label: "Results", icon: GraduationCap },
    { href: "/lecturer/students", label: "Students", icon: Users },
    { href: "/lecturer/settings", label: "Settings", icon: Settings }
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/admissions", label: "Admissions", icon: GraduationCap },
    { href: "/admin/finance", label: "Finance", icon: CreditCard },
    { href: "/admin/exams", label: "Exams", icon: ClipboardList },
    { href: "/admin/operations", label: "Operations", icon: Settings }
  ]
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand"><GraduationCap size={24} /><span>Online University</span></div>
      <nav className="nav">
        {links[role].map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={pathname === href ? "nav-link active" : "nav-link"}>
            <Icon size={18} /><span>{label}</span>
          </Link>
        ))}
        <button className="nav-link" onClick={() => fetch("/api/auth/logout", { method: "POST" }).then(() => window.location.href = "/login")}>
          <LogOut size={18} /><span>Sign out</span>
        </button>
      </nav>
    </aside>
  );
}