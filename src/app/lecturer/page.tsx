import { PortalLayout } from "@/components/PortalLayout";
import { LecturerDashboard } from "@/components/LecturerDashboard";

export default function LecturerPage() {
  return (
    <PortalLayout role="lecturer" title="Lecturer Portal">
      <LecturerDashboard />
    </PortalLayout>
  );
}
