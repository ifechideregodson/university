export type Role = "student" | "lecturer" | "admin";

export type Course = {
  id: string;
  code: string;
  title: string;
  unit: number;
  level?: number;
  semester?: string;
  description?: string;
};

export type Question = {
  id: string;
  examId: string;
  text: string;
  options: string[];
  answer?: string;
  marks?: number;
};

export type Exam = {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  published?: boolean;
  questions?: Question[];
};

export type Student = {
  id: string;
  matricNo: string;
  name: string;
  email: string;
  programme?: string;
  level?: number;
  status?: string;
};