import { PortalLayout } from "@/components/PortalLayout";
import { AdminDashboard } from "@/components/AdminDashboard";

export default function Admin() {
  return (
    <PortalLayout role="admin" title="University Administration">
      <AdminDashboard />
    </PortalLayout>
  );
}
