import type { Course, Exam, Student } from "@/lib/types";

export const courses: Course[] = [
  { id: "csc101", code: "CSC101", title: "Introduction to Computer Science", unit: 3, level: 100, semester: "First" },
  { id: "csc201", code: "CSC201", title: "Data Structures", unit: 3, level: 200, semester: "First" },
  { id: "mat101", code: "MAT101", title: "Elementary Mathematics", unit: 3, level: 100, semester: "First" }
];

export const students: Student[] = [
  { id: "stu-001", matricNo: "OU/2026/0001", name: "Demo Student", email: "student@example.com", programme: "Computer Science", level: 100, status: "Active" }
];

export const exams: Exam[] = [
  { id: "exam-001", courseId: "csc101", title: "CSC101 Mid-Semester Test", durationMinutes: 30, published: true, questions: [] }
];