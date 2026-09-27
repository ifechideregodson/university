import { PortalLayout } from "@/components/PortalLayout";
import { StudentDashboard } from "@/components/StudentDashboard";

export default function StudentDashboardPage() {
  return (
    <PortalLayout role="student" title="Student Portal">
      <StudentDashboard />
    </PortalLayout>
  );
}
