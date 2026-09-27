import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function AdminSystem() {
  return <PortalLayout role="admin" title="System Control">
    <FeatureTable title="System Control Centre" description="Platform health, security and configuration status." action="list_system_status"
      columns={[{key:"service",label:"Service"},{key:"status",label:"Status"},{key:"mode",label:"Mode"},{key:"lastCheck",label:"Last Check"}]} />
  </PortalLayout>;
}
