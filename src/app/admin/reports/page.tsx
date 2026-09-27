import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function AdminReports() {
  return <PortalLayout role="admin" title="Reports & Analytics">
    <FeatureTable title="University Reports" description="Operational, academic and financial reporting." action="list_reports"
      columns={[{key:"name",label:"Report"},{key:"category",label:"Category"},{key:"value",label:"Value"},{key:"updated",label:"Updated"}]} />
  </PortalLayout>;
}
