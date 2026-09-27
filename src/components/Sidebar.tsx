"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CalendarDays, ClipboardList, CreditCard, FileBarChart, FileText, GraduationCap, LayoutDashboard, LogOut, Settings, ShieldCheck, UserCheck, Users, Bell, IdCard } from "lucide-react";
import type { Role } from "@/lib/types";

const links: Record<Role, { href: string; label: string; icon: React.ComponentType<{size?: number}> }[]> = {
  student: [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/courses", label: "Courses", icon: BookOpen },
    { href: "/student/timetable", label: "Timetable", icon: CalendarDays },
    { href: "/student/attendance", label: "Attendance", icon: UserCheck },
    { href: "/student/exams", label: "Exams", icon: ClipboardList },
    { href: "/student/results", label: "Results", icon: GraduationCap },
    { href: "/student/transcript", label: "Transcript", icon: FileBarChart },
    { href: "/student/assignments", label: "Assignments", icon: FileText },
    { href: "/student/payments", label: "Payments", icon: CreditCard },
    { href: "/student/id-card", label: "ID Card", icon: IdCard },
    { href: "/student/notifications", label: "Notifications", icon: Bell },
    { href: "/student/profile", label: "Profile", icon: Users }
  ],
  lecturer: [
    { href: "/lecturer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/lecturer/courses", label: "Courses", icon: BookOpen },
    { href: "/lecturer/timetable", label: "Timetable", icon: CalendarDays },
    { href: "/lecturer/attendance", label: "Attendance", icon: UserCheck },
    { href: "/lecturer/exams", label: "Exams", icon: ClipboardList },
    { href: "/lecturer/materials", label: "Materials", icon: FileText },
    { href: "/lecturer/assignments", label: "Assignments", icon: FileText },
    { href: "/lecturer/results", label: "Results", icon: GraduationCap },
    { href: "/lecturer/students", label: "Students", icon: Users },
    { href: "/lecturer/notifications", label: "Notifications", icon: Bell },
    { href: "/lecturer/settings", label: "Settings", icon: Settings }
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/academics", label: "Academics", icon: GraduationCap },
    { href: "/admin/admissions", label: "Admissions", icon: UserCheck },
    { href: "/admin/finance", label: "Finance", icon: CreditCard },
    { href: "/admin/exams", label: "Exams", icon: ClipboardList },
    { href: "/admin/reports", label: "Reports", icon: FileBarChart },
    { href: "/admin/notifications", label: "Notifications", icon: Bell },
    { href: "/admin/system", label: "System", icon: ShieldCheck },
    { href: "/admin/operations", label: "Operations", icon: Settings }
  ]
};

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="brand"><GraduationCap size={24} /><span>Doorway</span></div>
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
